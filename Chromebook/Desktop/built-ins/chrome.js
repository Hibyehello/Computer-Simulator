import {BaseApp} from "./app.js";

export class Chrome extends BaseApp {
    constructor() {
        super("Chrome", "720px", "1280px");
        this.displayType = "flex"
        this.appDiv.classList.add("window-App");
        this.appDiv.classList.add("resizable-win");
        this.appDiv.style.top = "0";
        this.appDiv.style.flexDirection = "column";

        this.createHeader();
        this.appHeader.style.background = "gray";

        this.createIcon("img/Google_Chrome_icon_(September_2014).svg.png");

        this.loadContent();
    };

    loadContent() {
        let content = document.createElement("div");
        content.style.position = "relative";
        content.style.height = "100%";
        content.style.width = "100%";
        let iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.src = "https://google.com/?igu=1";
        iframe.style.height = "100%";
        iframe.style.width = "100%";
        iframe.style.border = "0";

        let cover = document.createElement("div");
        cover.style.position = "absolute";
        cover.style.height = "100%";
        cover.style.width = "100%";
        cover.style.opacity = "100";
        cover.style.zIndex = "2";

        cover.addEventListener("click", function () {
            cover.style.display = "none";
        });

        document.addEventListener('click', (e) => {
            if (e.target !== iframe && e.target !== cover && !iframe.contains(e.target)) {
                cover.style.display = 'block';
            }
        });

        content.appendChild(cover);
        content.appendChild(iframe);

        this.appDiv.appendChild(content);
    }

    focusApp() {
        super.focusApp();

        this.appHeader.style.background = "lightblue";
    }

    unfocusApp() {
        super.unfocusApp();

        this.appHeader.style.background = "gray";
    }
}

//   <div id="app-Chrome" class="window-App resizable-win" onclick="document.getElementById('searchApps').className = 'searchApps-Closed';">
//     <div id="app-Chrome-header">
//       <div id="windowMenu" class="window-Menu">
//         <table>
//           <tr>
//             <td id="settingsMinimize" class="settings-option" onmousedown="closeApp('app-Chrome');" onmouseover="svgHover('settingsExit')" onmousemove="svgLeave('settingsExit')">
//               <!--<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#000000'><path d='M0 0h24v24H0V0z' fill='none'/><path d='M6 19h12v2H6v-2z'/></svg>-->
//               <img id="settingsMinimize_img" src="img/minimize_black_24dp.svg">
//             </td>
//             <td id="settingsFull" class="settings-option" onclick="" onmouseover="svgHover('settingsFull')" onmousemove="svgLeave('settingsFull')">
//               <!--<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>-->
//               <img id="settingsFull_img" src="img/fullscreen_black_24dp.svg">
//             </td>
//             <td id="settingsExit" class="settings-option" onmousedown="closeApp('app-Chrome');" onmouseover="svgHover('settingsExit')" onmousemove="svgLeave('settingsExit')">
//               <!--<btn><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></btn>!-->
//               <img id="settingsExit_img" src="img/close_black_24dp.svg">
//             </td>
//           </tr>
//         </table>
//       </div><!-- windowMenu -->
//     </div>
//     <div id="Chrome-inner" class="Chrome-inner">
//       <img id="app-Chrome-Logo" class="app-Chrome-Logo" src="img/googlelogo_color_272x92dp.png">
//       <div id="search-Chrome" class="searchApps-Chrome">
//         <img id="app-Chrome-SearchImg" class="app-Chrome-SearchImg" onclick="openApp('app-Chrome');" src="img/search_black_24dp.svg">
//         <input id="app-Chrome-Input" class="app-Chrome-Input" type="input" onchange="googleSearch(this.value);">
//       </div>
//     </div>
//     <!-- <iframe id="chrome-iframe" src="https://www.youtube.com/embed/uD4izuDMUQA?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" frameborder="0" allowfullscreen></iframe> -->
//   </div><!-- app-Chrome --></div>