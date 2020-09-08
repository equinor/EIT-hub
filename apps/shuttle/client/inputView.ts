/* istanbul ignore file */
export default class InputView{
    // 1: GamePad
    // 2: Keyboard
    private _selection = 0;
    constructor(private rootElem: HTMLElement) {
        this.rootElem.querySelector<HTMLElement>("#gamepad-button")!.onclick = () => {
            this._selection = 1;

            this.rootElem.querySelector<HTMLElement>("#gamepad-info")!.style.display='block';
            this.rootElem.querySelector<HTMLElement>("#keyboard-info")!.style.display='none';
        }

        
        this.rootElem.querySelector<HTMLElement>("#keyboard-button")!.onclick = () => {
            this._selection = 2;

            this.rootElem.querySelector<HTMLElement>("#keyboard-info")!.style.display='block';
            this.rootElem.querySelector<HTMLElement>("#gamepad-info")!.style.display='none';
        }
    }

    useKeyboard(): boolean {
        return this._selection === 2;
    }

    useGamePad():boolean {
        return this._selection === 1;
    }

    setData(msg: { x: number; y: number; z: number; r: number; }): void {
        this.rootElem.querySelector<HTMLElement>("#dataText")!
            .innerText = ` Input values:\n x: ${msg.x.toFixed(3)}  y: ${msg.y.toFixed(3)}  z: ${msg.z.toFixed(3)}  r: ${msg.r.toFixed(3)}  `;
    }

    updateGamepadImage(x: number,y: number,z: number,r: number,armButton: boolean,disarmButton: boolean,manual: boolean,stabilize: boolean,depthHold: boolean):void {

        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1 ) {
            this.rootElem.querySelector<SVGElement>("#svg_1")!.style.fill = "red";  //arm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_1")!.style.fill = "cecece";  
        }

        if (Math.abs(z) > 0.1 || Math.abs(r) > 0.1 ) {
            this.rootElem.querySelector<SVGElement>("#svg_2")!.style.fill = "red";  //arm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_2")!.style.fill = "cecece";  
        }

        if (armButton) {
            this.rootElem.querySelector<SVGElement>("#svg_17")!.style.fill = "red";  //arm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_17")!.style.fill = "cecece";  
        }

        if (disarmButton) {
            this.rootElem.querySelector<SVGElement>("#svg_8")!.style.fill = "red";  //disarm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_8")!.style.fill = "cecece";  
        }

        if (manual) {
            this.rootElem.querySelector<SVGElement>("#svg_6")!.style.fill = "red";  //arm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_6")!.style.fill = "cecece";  
        }

        if (stabilize) {
            this.rootElem.querySelector<SVGElement>("#svg_7")!.style.fill = "red";  //disarm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_7")!.style.fill = "cecece";  
        }

        if (depthHold) {
            this.rootElem.querySelector<SVGElement>("#svg_5")!.style.fill = "red";  //disarm
        } else {
            this.rootElem.querySelector<SVGElement>("#svg_5")!.style.fill = "cecece";  
        }
    }
}