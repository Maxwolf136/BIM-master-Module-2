import * as React from "react";
import * as OBC from "@thatopen/components"


/* interface IViewerContext {
    viewer: OBC.Components | null
    setViewer: (viewer: OBC.Components | null) => void
    
  } */
  
/*   export const ViewerContext = React.createContext<>({
    viewer: null,
    setViewer: () => {}
    
  })
  
  export function ViewerProvider(props: {children: React.ReactNode}) {
    const [viewer, setViewer] = React.useState<OBC.Components | null>(null)
    return (
      <ViewerContext.Provider value={{ viewer, setViewer }}>
        {props.children}
      </ViewerContext.Provider>
    )
  }
 */
 


export function IFCViewer() {
    const components  =  new OBC.Components()



    const setViewer = () => {
        const worlds = components.get(OBC.Worlds)
        const world = worlds.create<
            OBC.SimpleScene,
            OBC.OrthoPerspectiveCamera,
            OBC.SimpleRenderer
        >()

        const sceneComponent = new OBC.SimpleScene(viewer)
        world.scene = sceneComponent
        world.scene.setup()
        world.scene.three.background = null

        const viewerContainer = document.getElementById("viewer-container")  as HTMLElement
        const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer);
        world.renderer = rendererComponent

        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
        world.camera = cameraComponent

        viewer.init()
        cameraComponent.updateAspect()
        
        const ifcLoader = components.get(OBC.IfcLoader)
        ifcLoader.load()

    }

    const setupUI = () => {
        const viewerContainer = document.getElementById("viewer-container")  as HTMLElement
        if(!viewerContainer) return
    }

   const {setViewer} = React.useContext(ViewerContext)
   let viewer: OBC.Components
 /*    const createViewer = async () => {
        viewer = new OBC.Components()
        setViewer(viewer)

        const sceneComponent = new OBC.SimpleScene(viewer)
        sceneComponent.setup()
        viewer.scene = sceneComponent
        const scene = sceneComponent.get()
        scene.background = null
        
        const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
        const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
        viewer.renderer = rendererComponent
        
        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
        viewer.camera = cameraComponent
        
        const raycasterComponent = new OBC.SimpleRaycaster(viewer)
        viewer.raycaster = raycasterComponent
        
        viewer.init()
        cameraComponent.updateAspect()
        rendererComponent.postproduction.enabled = true
        
        const fragmentManager = new OBC.FragmentManager(viewer)
        
        function exportFragment(model: FragmentsGroup) {
            const fragmentBinary = fragmentManager.export(model)
            const blob = new Blob([fragmentBinary]) // skapar en ny blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${model.name.replace(".ifc","")}.frag`
            a.click()
            URL.revokeObjectURL(url)
        }
        
        function exportJSONModel(model:FragmentsGroup) {
            const json = JSON.stringify(model)
            const blob = new Blob([json], {type: "application/json"}) // skapar en ny blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${model.name.replace(".ifc","")}.json`
            a.click()
            URL.revokeObjectURL(url)
        }
        
        function importJSONModel(model:FragmentsGroup) {
            const input = document.createElement(`input`)
            input.type = `file`
            input.accept = `application/json`
            const reader = new FileReader()
            reader.addEventListener( "load", () => {
                const json = reader.result
                if (!json) {return}
                model.properties = JSON.parse(json as string)
            })
        
        
            input.addEventListener(`change`, () => {
                const filelist = input.files
                if (!filelist) {return}
                reader.readAsText(filelist[0])
            })
            input.click()
        }
        
        
        
        const ifcLoader = new OBC.FragmentIfcLoader(viewer)
        ifcLoader.settings.wasm = {
          path: "https://unpkg.com/web-ifc@0.0.43/",
          absolute: true
        }
        
        const highlighter = new OBC.FragmentHighlighter(viewer)
        highlighter.setup()
        
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
        highlighter.events.select.onClear.add(() => {
            propertiesProcessor.cleanPropertiesList()
        })
        
        
        
        const classifier = new OBC.FragmentClassifier(viewer)
        
        const clasifcationWindow = new OBC.FloatingWindow(viewer)
        viewer.ui.add(clasifcationWindow)
        clasifcationWindow.visible = false
        clasifcationWindow.title = "Modellträd"
        
        const classifcationBtn = new OBC.Button(viewer)
        classifcationBtn.materialIcon ="account_tree"
        
        classifcationBtn.onClick.add(() =>{
            clasifcationWindow.visible = !clasifcationWindow.visible
            clasifcationWindow.active = clasifcationWindow.visible
        })
        
        async function createModalTree() {
            const fragmentTree = new OBC.FragmentTree(viewer)
            await fragmentTree.init()
            await fragmentTree.update(["model","storeys","entities"])
            fragmentTree.onHovered.add((fragmentMap) => {
                highlighter.highlightByID("hover", fragmentMap)
              })
              fragmentTree.onSelected.add((fragmentMap) => {
                highlighter.highlightByID("select", fragmentMap)
              })
            const tree = fragmentTree.get().uiElement.get("tree")
            return tree
        }
        
        //LOD kan man säga
        const culler = new OBC.ScreenCuller(viewer)
        cameraComponent.controls.addEventListener("sleep",  () =>{
            culler.needsUpdate = true
        })
        
        
        async function onModelLoaded(model: FragmentsGroup) {
        
            try {
                highlighter.update()
                for(const fragment of model.items) {culler.add(fragment.mesh)}
                culler.needsUpdate = true
                classifier.byModel(model.name, model)
                classifier.byStorey(model)
                classifier.byEntity(model)
                const tree = await  createModalTree()
                console.log(classifier.get())
                await clasifcationWindow.slots.content.dispose(true)
                clasifcationWindow.addChild(tree)
                console.log(model)
            
                propertiesProcessor.process(model)
                highlighter.events.select.onHighlight.add((fragmentmap) =>{
                    const expressID = [...Object.values(fragmentmap)[0]][0]
                    propertiesProcessor.renderProperties(model, Number(expressID) )
            
                })
            } catch (error) {
                console.warn(error)
            }
        }
        
        
        
        ifcLoader.onIfcLoaded.add(async(model) => {
            exportFragment(model)
            onModelLoaded(model)
            exportJSONModel(model)
        })
        
        
        fragmentManager.onFragmentsLoaded.add((model) => {
            onModelLoaded(model)
            importJSONModel(model)
            console.log(model)
        })
        
        const importFragmentBtn = new OBC.Button(viewer)
        importFragmentBtn.materialIcon = "upload"
        importFragmentBtn.tooltip = "load FRAG"
        
        importFragmentBtn.onClick.add(() => {
            const input = document.createElement(`input`)
            input.type = `file`
            input.accept = `.frag`
            const reader = new FileReader()
            reader.addEventListener( "load", async() => {
                const binary = reader.result
                if(!(binary instanceof ArrayBuffer)) {return}
                const fragmentBinary = new Uint8Array(binary)
                await fragmentManager.load(fragmentBinary)
            })
         
            input.addEventListener(`change`, () => {
                const filelist = input.files
                if (!filelist) {return}
                reader.readAsArrayBuffer(filelist[0])
            })
            input.click()
        })
        
        const toDoCreator = new TodoCreator(viewer)
        await toDoCreator.setup()
        toDoCreator.onProjectCreated.add((todo) =>{
        console.log(todo)
        }) 
        
       const simpleQto = new SimpleQTO(viewer)
        await simpleQto.setup()
        
        
        const propertiesFinder = new OBC.IfcPropertiesFinder(viewer)
        await propertiesFinder.init()
        propertiesFinder.onFound.add((fragmentIDMap) => {
            highlighter.highlightByID("select", fragmentIDMap)
          }) 
        
        //TOOLBAR
        
        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          classifcationBtn,
          propertiesProcessor.uiElement.get("main"),
          importFragmentBtn,
          fragmentManager.uiElement.get("main"),
          toDoCreator.uiElement.get("activationButton"),
          simpleQto.uiElement.get("activationBtn"),
          propertiesFinder.uiElement.get("main"),
        
        )
        viewer.ui.addToolbar(toolbar)
        
    } */


    React.useEffect(() => {
        createViewer()
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