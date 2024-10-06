import React  from "react";
import *  as BUI from "@thatopen/ui";
import { element } from "three/examples/jsm/nodes/Nodes.js";



export function UserPage() {
    const userTable = BUI.Component.create<BUI.Table>(() => {

    const onTableCreated = (element?: Element) => {
     const table = element as BUI.Table;
        table.data = [
        {
            data: {
                Name: "Msc",
                Task: "HAAS",
                Role: "HAAS Engineer",
            }
        },
        {
            data: {
                Name: "Msc",
                Task: "HAAS",
                Role: "HAAS Engineer",
            }
        },
        {
            data: {
                Name: "Msc",
                Task: "HAAS",
                Role: "HAAS Engineer",
            }
        },
      ]
    }

    return BUI.html`
        <bim-table ${BUI.ref(onTableCreated)}></bim-table>
    `
})

    const content = BUI.Component.create<BUI.Panel> (() => {
       return BUI.html `
       <bim-panel>
            <bim-panel-section label="Task">
                ${userTable}
            <bim-panel-section>
       </bim-panel>
       `
    })

    const sidebar = BUI.Component.create<BUI.Component> (() => {
        const buttonStyles = {
            "height": "50px",
        }

        return BUI.html `
         <div style="padding: 4px" style="display:Flex">
            <bim-button id="btnTask"
                style=${BUI.styleMap(buttonStyles)}
                icon="ion:print-sharp"
                @click=${()=>{
                    console.log(userTable.value);
                }}
            ></bim-button>
            <bim-button id="btnTask"
                style=${BUI.styleMap(buttonStyles)}
                icon="subway:time-1"
                @click=${()=>{
                const csvData = userTable.csv
                const blob = new Blob([csvData], {type: "text/csv"}) // skapar en ny blob
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "userslist.csv"
                a.click()
                URL.revokeObjectURL(url)
                }}
            ></bim-button>
         </div>
        `
    })

    const footer = BUI.Component.create<BUI.Component> (() => {
        return BUI.html `
        <div style="display: flex; justify-content: center;">
            <bim-label>copyright OPTA BIM</bim-label>
        </div>

        `;
    })

    const gridLayout: BUI.Layouts = {
        primary: {
            template: `
                "header header" 40px
                "content sidebar" 1fr
                "footer footer"  40px
                /1fr 60px
            `,
            elements: {
                header: (() => {
                    const inputSearch = BUI.Component.create<BUI.TextInput> (()=> {
                        return BUI.html `
                        <bim-text-input style="padding: 8px" placeholder="här söker du"></bim-text-input>
                        `
                    })
                    inputSearch.addEventListener("input", ()=> {
                        userTable.queryString = inputSearch.value
                    })
                    return inputSearch
                })(),
                sidebar,
                content,
                footer,
            }
    
        }
    }

    React.useEffect (()=> {
        
        const grid = document.getElementById("bimGrid") as BUI.Grid
        grid.layouts = gridLayout;
        grid.layout = "primary"
    }, [])  

    return(
    <div>
        <bim-grid id="bimGrid">HEJ</bim-grid>
    </div>
 )
}