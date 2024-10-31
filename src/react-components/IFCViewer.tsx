import * as React from "react";
import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc"
import * as OBCF from "@thatopen/components-front"
import { triplanarTexture } from "three/examples/jsm/nodes/Nodes.js";



export function IFCViewer() {
    const components  =  new OBC.Components()

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

        const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
        world.camera = cameraComponent

        components.init()
        cameraComponent.updateAspect()
        
        const ifcLoader = components.get(OBC.IfcLoader)
        ifcLoader.setup()
        
        const fragmentsManager = components.get(OBC.FragmentsManager)
        fragmentsManager.onFragmentsLoaded.add((model) => {
            console.log(model)
            world.scene.three.add(model)
            
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

        const toolbar = BUI.Component.create<BUI.Grid> (() => {
            const [loadifcBtn] = CUI.buttons.loadIfc({components: components})
            return BUI.html `
        <bim-toolbar style="justify-content: center">
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
            }
        }
        floatingGrid.layout = "main"
        viewerContainer.appendChild(floatingGrid)

    }



    React.useEffect(() => {
        setViewer();
        setupUI()
        return () => {
            components.dispose()
            setViewer()
        }
    }, [])


    return (
        <bim-viewport
            id="viewer-container"
         />
    );
}