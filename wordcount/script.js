function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

const ignoreOptions = [
  [ 'APA Citations', /([ ]?\((([^)]+?,|)[ ]?[0-9]{4})+?\))/g ],
];

const optionsHTML = ignoreOptions.map(([label, _]) => `
  <div class="row">
    <input type="checkbox" name="${label}">
    <label for="${label}">Ignore APA Citations</label>
  </div>
`).join('');

const settingsModal = `
  <div class="modal">
    <div class="content">
      <div class="title">
        Settings
      </div>
      <form>
        ${optionsHTML}

        <div class="row submit">
          <input type="button" value="Ok">
          <input type="button" value="Cancel">
        </div>
      </form>
    </div>
  </div>
`;

let ignoreSet = new Map();

docReady(() => {
  const input = document.querySelector("#input");
  const wordCount = document.querySelector("#word-count");

  const recalc = () => {
    let raw = input.value.trim();
    for (const [_, regexp] of ignoreSet.entries()) {
      raw = raw.replace(regexp, '');
    }
    const tokens = raw.split(/\s/).filter(x => x.length);
    console.log(tokens);
    wordCount.innerText = tokens.length;
  }

  input.oninput = (e) => recalc();

  recalc();

  document.getElementById('show-settings').onclick = () => {
    let modal = document.createElement('div');
    modal.innerHTML = settingsModal;

    ignoreOptions.forEach(([label, regexp]) => {
      let el = modal.querySelector(`input[name="${label}"]`);
      el.checked = ignoreSet.has(label);
    });

    modal.querySelector('input[value="Ok"]').addEventListener('click', () => {
      ignoreOptions.forEach(([label, regexp]) => {
        let el = modal.querySelector(`input[name="${label}"]`);
        if (el.checked) {
          ignoreSet.set(label, regexp);
        } else {
          ignoreSet.delete(label);
        }
      });

      document.body.removeChild(modal);
      recalc();
    });

    modal.querySelector('input[value="Cancel"]').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
  };
});

