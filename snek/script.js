function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

let rule = (seq) => {
    let ok = true;
    for (let i = 0; i < seq.length; ++i) {
        ok &= (seq[i] == 'R');
    }
    return ok;
};

docReady(() => {
    let ruleEnc = document.querySelector('#levelConfig input[name="rule"]');
    ruleEnc.value = btoa(rule.toString()).toString();
    console.log(rule.toString());

    document.querySelector('#levelConfig input[name="applyRule"]').addEventListener('click', () => {
        let ruleEnc = document.querySelector('#levelConfig input[name="rule"]').value;
        rule = eval(atob(ruleEnc));
        console.log(ruleEnc);
        console.log(rule);

        [
            document.querySelector('#lab > .canvas'),
            document.querySelector('#board > .good > .canvas'),
            document.querySelector('#board > .bad > .canvas')
        ]
            .forEach(canvas => {
                while (canvas.hasChildNodes()) {
                    canvas.removeChild(canvas.firstChild);
                }
            });
    });

    let infoModal = `
        <div class="modal">
            <div class="content">
                <div class="title">
                    Info
                </div>
                <form>
                    <p>Paste the base64 encoded string of a rule function here.</p>
                    <p>To make a rule, write a javascript function taking in an array consisting of some sequence of 'R', 'O', 'Y', 'G', 'B', and 'V', that returns a boolean (true for good snek, false for bad snek) and call btoa() on stringified function (f.toString).</p>
                    <p>Follow the project on <a href="https://github.com/l-yc/miniweb-snek">github</a>!</p>

                    <div class="row submit">
                        <input type="button" value="Ok">
                    </div>
                </form>
            </div>
        </div>
    `;
    document.querySelector('#levelConfig input[name="infoRule"]').addEventListener('click', () => {
        let modal = document.createElement('div');
        modal.innerHTML = infoModal;
        modal.querySelector('input[value="Ok"]').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        document.body.appendChild(modal);
    });

    Array.from(document.getElementsByClassName('addSnek')).forEach(element => {
        element.addEventListener('click', () => {
            console.log('adding snek');
            let canvas = document.querySelector('#lab > .canvas');
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width',32);
            svg.setAttribute('height',48);
            svg.setAttribute('viewbox','0 0 32 48');
            svg.setAttribute('style','margin:2px');
            svg.dataset.code = element.dataset.code;

            let color = window.getComputedStyle(element,null).getPropertyValue('background-color');
            if (canvas.firstChild) {
                let rect = document.createElementNS(svg.namespaceURI, 'rect');
                rect.setAttribute('width',32);
                rect.setAttribute('height',48);
                rect.setAttribute('fill',color);
                svg.appendChild(rect);
            } else {
                let path = document.createElementNS(svg.namespaceURI, 'path');
                path.setAttribute('d',
                    `
                    M 16 0
                    L 32 0
                    L 32 48
                    L 16 48
                    A 16 24 0 1 1 16 0
                    Z
                    `
                );
                path.setAttribute('fill',color);
                svg.appendChild(path);

                //let circle = document.createElementNS(svg.namespaceURI, 'circle');
                //circle.setAttribute('cx',12);
                //circle.setAttribute('cy',16);
                //circle.setAttribute('r',3);
                let circle = document.createElementNS(svg.namespaceURI, 'path');
                circle.setAttribute('d',
                    `
                    M 12 16
                    m -3, 0
                    a 3,3 0 1,0 6,0
                    a 3,3 0 1,0 -6,0
                    `
                );

                circle.setAttribute('fill','rgb(0,0,0)');
                svg.appendChild(circle);
            }
            canvas.appendChild(svg);
        });
    });

    document.getElementById('deleteSnek').addEventListener('click', () => {
        console.log('deleting snek');
        let canvas = document.querySelector('#lab > .canvas');
        if (canvas.lastChild) {
            canvas.removeChild(canvas.lastChild);
            // TODO reshape the last child
        }
    });

    document.getElementById('checkSnek').addEventListener('click', () => {
        console.log('checking snek');
        let canvas = document.querySelector('#lab > .canvas');
        let seq = [];

        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        //svg.setAttribute('width',32);
        //svg.setAttribute('height',48);
        //svg.setAttribute('viewbox','0 0 32 48');
        //svg.setAttribute('style','margin:2px');

        let bnd = 0;
        while (canvas.hasChildNodes()) {
            let e = canvas.firstChild;

            seq.push(e.dataset.code);
            //let g = document.createElementNS(svg.namespaceURI, 'g');
            //g.setAttribute('transform',`translate(${bnd})`);
            //while (e.hasChildNodes()) g.appendChild(e.firstChild);
            //svg.appendChild(g);
            //canvas.removeChild(e);
            e.setAttribute('x',bnd);
            svg.appendChild(e);

            bnd += parseInt(e.getAttribute('width')) + 4;
        }
        svg.setAttribute('viewbox',`0 0 ${bnd} 48`);
        svg.setAttribute('height',48);

        svg.dataset.code = seq;
        let res = rule(seq);
        console.log(seq + " ruled " + res);

        console.log(svg);
        let board = (res ?
            document.querySelector('#board > .good > .canvas') :
            document.querySelector('#board > .bad > .canvas'));
        board.appendChild(svg);
    });
});
