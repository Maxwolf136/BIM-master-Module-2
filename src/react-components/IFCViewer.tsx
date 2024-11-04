import * as React from "react";
import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc"
import * as OBCF from "@thatopen/components-front"
import { Fragment, FragmentsGroup } from "@thatopen/fragments";
import { floorPowerOfTwo } from "three/src/math/MathUtils.js";


export function IFCViewer() {
    const components  =  new OBC.Components()
    let fragmentModel: FragmentsGroup | undefined
    const [classificationTree, updateclassificationTree] = CUI.tables.classificationTree({components, classifications: []},  )


    const setViewer = () => {
        const worlds = components.get(OBC.Worlds)
        const world = worlds.create<
            OBC.SimpleScene,
            OBC.OrthoPerspectiveCamera,
            OBCF.PostproductionRenderer
        >()
        const sceneComponent = new OBC.SimpleScene(components)
        world.scene = sceneComponent
        world.scene.setup()
        /* world.scene.three.background = null */
        const viewerContainer = document.getElementById("viewer-container")  as HTMLElement
        const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer);
        world.renderer = rendererComponent

        rendererComponent.postproduction.updateProjection

        const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
        world.camera = cameraComponent

        components.init()


        const renderSettings  = world.renderer.postproduction.settings
        renderSettings.gamma = false

        world.renderer.postproduction.enabled  = true
    
        cameraComponent.updateAspect()

        world.camera.controls.setLookAt(13,13,13,0,0,0)
        
        const ifcLoader = components.get(OBC.IfcLoader)
        ifcLoader.setup()
        
        const fragmentsManager = components.get(OBC.FragmentsManager)
        fragmentsManager.onFragmentsLoaded.add(async (model) => {
            console.log(model)
            world.scene.three.add(model)

            const indexer = components.get(OBC.IfcRelationsIndexer);
            await indexer.process(model)

            fragmentModel = model
            
            const classifier = components.get(OBC.Classifier)
            await classifier.bySpatialStructure(model)
            classifier.byEntity(model)
            await classifier.byPredefinedType(model)
           

            console.log(classifier.list)

            //har vi en uppdaterad lista, lägg till listan enligt classficationArrayen
            const classifications =  [
                {
                 system: "entities", label: "Entities"   
                },
                {
                 system: "spatialStructures", label: "SpacialStructure"   
                },
                {
                 system: "predefinedTypes", label: "PredefinedType"   
                }
            ]
            if(updateclassificationTree) {
                updateclassificationTree({classifications})
            }
            
        })

        const highlighter = components.get(OBCF.Highlighter)
        highlighter.setup({world})
        highlighter.zoomToSelection = true


        viewerContainer.addEventListener("resize", () => {
            rendererComponent.resize()
            cameraComponent.updateAspect()
        })

    


    }

    const onToggleVisbility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const fragments = components.get(OBC.FragmentsManager)
        const selection = highlighter.selection.select 
        if(Object.keys(selection).length === 0 ) return
        for(const fragmentID in selection) {
            const fragment  = fragments.list.get(fragmentID)
            const expressID = selection[fragmentID]
            for(const id of expressID) {
                if(!fragment) continue
                const isHidden = fragment.hiddenItems.has(id)
                if(isHidden) {
                    fragment.setVisibility(true, [id])
                } else {
                    fragment.setVisibility(false, [id] )
                }
            }
        }
        highlighter.zoomToSelection = true
    
        console.log("nartub")
    }

    const onIsolate = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const hider = components.get(OBC.Hider)
        const slection = highlighter.selection.select
        hider.isolate(slection)

    }

    const onShowAll = () => {
        const hider = components.get(OBC.Hider)
        hider.set(true)

    }




    const onShowProperties = async () =>  {
        if(!fragmentModel) return
        const highlighter = components.get(OBCF.Highlighter)
        const fragments = components.get(OBC.FragmentsManager)
        const selection = highlighter.selection.select 
        const indexer = components.get(OBC.IfcRelationsIndexer)
        if(Object.keys(selection).length === 0 ) return
        for(const fragmentID in selection) {
            const fragment  = fragments.list.get(fragmentID)
            const expressID = selection[fragmentID]
            for(const id of expressID) {
                const psets = indexer.getEntityRelations(fragmentModel, id, "IsDefinedBy")
                if(!psets) return
                for(const expressId of psets) {
                    const prop = await fragmentModel.getProperties(expressId)
                    console.log(prop)
                }
            }
         }
    }



    const setupUI = () => {
        const viewerContainer = document.getElementById("viewer-container")  as HTMLElement
        if(!viewerContainer) return
        const floatingGrid = BUI.Component.create<BUI.Grid> (() => {
            return BUI.html `
            <bim-grid
            floating
            style ="padding: 20px",
            ></bim-grid>
            `
        })


        const elementPropertiesPanel = BUI.Component.create<BUI.Panel>(() => {
            const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
                components,
                fragmentIdMap: {}
            })
            const highlighter = components.get(OBCF.Highlighter)
            highlighter.events.select.onHighlight.add((fragmentIdMap) => {
                if(!floatingGrid) return
                floatingGrid.layout = "second"
                updatePropsTable({fragmentIdMap})
                propsTable.expanded = false
                
            })
            highlighter.events.select.onClear.add((fragmentIdMap) => {
                updatePropsTable({fragmentIdMap: {}})
                if(!floatingGrid) return
                floatingGrid.layout = "main"
            })

            const search = (e: Event) => {
                const input = e.target as BUI.TextInput
                propsTable.queryString = input.value
            }
            
            return BUI.html `
            <bim-panel>
                <bim-panel-section
                label = "Properties information"
                icon ="solar:document-bold"
                fixed
                color = "black"
                > <bim-text-input @input=${search}
                placeholder= "Search.. "
                ></bim-text-input>
                 ${propsTable}
                 </bim-panel-section>
            </bim-panel>

            `
        })

        const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
            return BUI.html `
            <bim-panel>
                <bim-panel-section
                name = "Classification"
                label = "Classification"
                icon ="solar:document-bold"
                fixed
                color = "black"
                > ${classificationTree}
                </bim-panel-section>
            </bim-panel>

            `
        }) 

        const worldPanel = BUI.Component.create<BUI.Panel>(() => {
            const [worldTable] = CUI.tables.worldsConfiguration({components})

            
            const search = (e: Event) => {
                const input = e.target as BUI.TextInput
                worldTable.queryString = input.value
            }

            return BUI.html `
            <bim-panel>
                <bim-panel-section
                name = "world"
                label = "world information"
                icon ="solar:document-bold"
                fixed
                color = "black"
                > <bim-text-input @input=${search}
                placeholder= "Search.. "
                ></bim-text-input>
                 ${worldTable}
                 </bim-panel-section>
            </bim-panel>

            `
        })

        const onWorldsUpdate = () => {
            if(!floatingGrid) return
            floatingGrid.layout = "world"
        }

        const onClassifier = () => {
            if(!floatingGrid) return
            if(floatingGrid.layout !== "classifier") {
                floatingGrid.layout = "classifier"
            } else {
                floatingGrid.layout = "main"
            }
        }

        const toolbar = BUI.Component.create<BUI.Grid> (() => {
            const [loadifcBtn] = CUI.buttons.loadIfc({components: components})
            return BUI.html `
        <bim-toolbar style="justify-content: center">
            <bim-toolbar-section>
                <bim-button
                label= "world"
                icon= "tabler:brush"
                @click= ${onWorldsUpdate}
                >
                </bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Import">
            ${loadifcBtn}
            </bim-toolbar-section>
            <bim-toolbar-section label="Selection">
            <bim-button 
                label="Visibility" 
                icon="mdi:users" 
                @click = ${onToggleVisbility}
            >
            </bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Selection">
            <bim-button 
                label="Isolate" 
                icon="mdi:users" 
                @click = ${onIsolate}
            >
            </bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Show All">
            <bim-button 
                label="Show All" 
                icon="mdi:users" 
                @click = ${onShowAll}
            >
            </bim-button>
            </bim-toolbar-section>
            <bim-toolbar-section label="Properties">
            <bim-button 
                label="Show Properties" 
                icon="mdi:users" 
                @click = ${onShowProperties}
            >
            </bim-button>
         </bim-toolbar-section>
            <bim-toolbar-section label="Groups">
                <bim-button 
                    label="Groups" 
                    icon="mdi:users" 
                    @click = ${onClassifier}
                >
                </bim-button>
            </bim-toolbar-section>
        </bim-toolbar>
            `
        })

        floatingGrid.layouts = {
            main: {
                template: `
                "empty" 1fr
                "toolbar" auto
                /1fr
                `,
                elements: {
                    toolbar
                }
            },
            second: {
                template: `
                "empty elementPropertiesPanel" 1fr
                "toolbar toolbar" auto
                /1fr 20rem
                `,
                elements: {
                    toolbar,
                    elementPropertiesPanel,
                }
            },
            world: {
                template: `
                "empty worldPanel" 1fr
                "toolbar toolbar" auto
                /1fr 20rem
                `,
                elements: {
                    toolbar,
                    worldPanel,
                }
            },
            classifier: {
                template: `
                "empty classifierPanel" 1fr
                "toolbar toolbar" auto
                /1fr 20rem
                `,
                elements: {
                    toolbar,
                    classifierPanel,
                }
            },
        }
        floatingGrid.layout = "main"
        viewerContainer.appendChild(floatingGrid)

    }



    React.useEffect(() => {
        setViewer();
        setupUI()

        return () => {
            if(components) {
                components.dispose()
            }
            if(fragmentModel) {
                fragmentModel.dispose();
                fragmentModel = undefined
            }
        }
    }, [])


    return (
        <bim-viewport
            id="viewer-container"
         />
    );
}