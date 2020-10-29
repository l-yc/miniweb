function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

let level = {
  name: 'default',
  rule: (seq) => {
      let ok = true;
      for (let i = 0; i < seq.length; ++i) {
          ok &= (seq[i] == 'R');
      }
      return ok;
  },
  win: () => {
      return 'RRRRRRR';
  },
  lose: () => {
      return 'ROYGBIV';
  },
};

function encodeLevel(lvl) {
  return [
    lvl.name,
    lvl.rule,
    lvl.win,
    lvl.lose,
  ].map(e => btoa(e).toString()).join('.');
}

function decodeLevel(enc) {
  let e = enc.split('.').map(e => atob(e));
  return {
    name: e[0],
    rule: eval(e[1]),
    win: eval(e[2]),
    lose: eval(e[3])
  };
}

docReady(() => {
    let levelEnc = document.querySelector('#levelConfig input[name="level"]');
    levelEnc.value = encodeLevel(level);

    document.querySelector('#levelConfig input[name="applyLevel"]').addEventListener('click', () => {
        let levelEnc = document.querySelector('#levelConfig input[name="level"]').value;
        level = decodeLevel(levelEnc);
        console.log(levelEnc);
        console.log(level);

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

        let levelName = document.querySelector('#levelName');
        levelName.innerHTML = level.name;
    });

    document.querySelector('#levelConfig input[name="challengeLevel"]').addEventListener('click', () => {
        console.log('clearing snek');
        let canvas = document.querySelector('#lab > .canvas');
        while (canvas.lastChild) {
            canvas.removeChild(canvas.lastChild);
        }

        for (let passed = 0; passed < 20; ++passed) {
            let str, res = Math.random() < 0.5;
            if (res) str = level.win();
            else str = level.lose();
            console.log('test item:', str, res);
            for (let c of str) {
                Array.from(document.getElementsByClassName('addSnek')).forEach(element => {
                    if (element.dataset.code == c) {
                        element.click();
                    }
                });
            };
          break;  // add wait for click
        }
    });

    let infoModal = `
        <div class="modal">
            <div class="content">
                <div class="title">
                    Info
                </div>
                <form>
                    <p>Paste the encoded string of a level function here.</p>
                    <p>To make a level, write a javascript object with property 'name' giving the level name and functions 'rule' taking in an array consisting of some sequence of 'R', 'O', 'Y', 'G', 'B', and 'V', that returns a boolean (true for good snek, false for bad snek), 'win' generating winning snakes, and 'lose' generating losing snakes. Pass the object into encodeLevel() (use the browser console) and save the output :)</p>
                    <p>Follow the project on <a href="https://github.com/l-yc/miniweb">github</a>!</p>

                    <div class="row submit">
                        <input type="button" value="Ok">
                    </div>
                </form>
            </div>
        </div>
    `;
    document.querySelector('#levelConfig input[name="infoLevel"]').addEventListener('click', () => {
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
        let res = level.rule(seq);
        console.log(seq + " ruled " + res);

        console.log(svg);
        let board = (res ?
            document.querySelector('#board > .good > .canvas') :
            document.querySelector('#board > .bad > .canvas'));
        board.appendChild(svg);
    });
});
