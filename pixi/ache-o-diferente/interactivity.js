const app = new PIXI.Application({
    // width: 800, height: 800,
    backgroundColor: 0xFFFFFF, 
    resolution: window.devicePixelRatio || 1,
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// let scale = scaleToWindow(app.renderer.view);
document.body.appendChild(app.renderer.view);

// create a background...
const background = PIXI.Sprite.from('assets/titulo.jpg');
//background.width = app.screen.width;
//background.height = app.screen.height;
//background.tint = Math.random() * 0xFFFFFF;
background.anchor.set(0.0);
background.x = 180;
background.y =10;

// add background to stage...
app.stage.addChild(background);

// create some textures from an image path
const textureButtons = [
    // first line button's textures
    {
        "textureButton": PIXI.Texture.from('assets/b1-ok.png'),
        "textureButtonDifferent": PIXI.Texture.from('assets/b1.png'),
        "okTextureButtonDown": PIXI.Texture.from('assets/b1-ok-1.png'),
        "errorTextureButtonDown": PIXI.Texture.from('assets/b1-error.png'),
    },
    // second line button's textures
    {
        "textureButton": PIXI.Texture.from('assets/b2-ok.png'),
        "textureButtonDifferent": PIXI.Texture.from('assets/b2.png'),
        "okTextureButtonDown": PIXI.Texture.from('assets/b2-ok-2.png'),
        "errorTextureButtonDown": PIXI.Texture.from('assets/b2-error.png'),
    },
    // third line button's textures
    {
        "textureButton": PIXI.Texture.from('assets/b3-ok.png'),
        "textureButtonDifferent": PIXI.Texture.from('assets/b3.png'),
        "okTextureButtonDown": PIXI.Texture.from('assets/b3-ok-3.png'),
        "errorTextureButtonDown": PIXI.Texture.from('assets/b3-error.png'),
    },
];



const buttons = [];

const x = 180;
const y = 180;
const xOffSet = 160;
const yOffSet = 180;
const buttonPositions = [
    // first line
    x ,              y,
    x + xOffSet,     y, 
    x + 2 * xOffSet, y,
    x + 3 * xOffSet, y,
    
    // second line
    x ,              y + yOffSet, 
    x + xOffSet,     y + yOffSet,
    x + 2 * xOffSet, y + yOffSet, 
    x + 3 * xOffSet, y + yOffSet, 

    // third line
    x ,              y + 2 * yOffSet, 
    x + xOffSet,     y + 2 * yOffSet,
    x + 2 * xOffSet, y + 2 * yOffSet, 
    x + 3 * xOffSet, y + 2 * yOffSet, 

];

const answerMap = [
    // first line
    true, false, false, false,
    // second line
    false, false, true, false,
    // third line
    true, false, false, false,
];

// used to storage if the answer was already choosed
// one aswer per line
let answerState = [ false, false, false];

let countRightAnswers = 0;
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
const numberOfRightAnswers = countOccurrences(answerMap, true);
console.log("Number of Right Answers", numberOfRightAnswers);

let line = 0;
const buttonsPerLine = 4;
const numberOfLines = (buttonPositions.length/2) / buttonsPerLine;
console.log("Number of lines", numberOfLines);

for (let i = 0; i < buttonPositions.length/2; i++) {
    
    let tex = textureButtons[line].textureButtonDifferent;
    if (answerMap[i]) {
        tex = textureButtons[line].textureButton;
    }
    const button = new PIXI.Sprite(tex);

    button.anchor.set(0.5);
    button.x = buttonPositions[i * 2];
    button.y = buttonPositions[i * 2 + 1];

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    // custom button configuration used in game 
    button.answer = answerMap[i];
    // which line the button belongs
    button.line = line;

    button.textureButton = tex;
    button.okTextureButtonDown = textureButtons[line].okTextureButtonDown;
    button.errorTextureButtonDown = textureButtons[line].errorTextureButtonDown;

    button
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

    // add it to the stage
    app.stage.addChild(button);

    // add button to array
    buttons.push(button);

    // calculating the line
    if ( ( i % buttonsPerLine) == numberOfLines ) {
        line++;       
    }

}

// set some silly values...
// buttons[0].scale.set(1.2);
// buttons[2].rotation = Math.PI / 10;
// buttons[3].scale.set(0.8);
// buttons[4].scale.set(0.8, 1.2);
// buttons[4].rotation = Math.PI;

function onButtonDown() {

    this.isdown = true;
    if (this.answer) {
        this.texture = this.okTextureButtonDown;
        if ( ! answerState[ this.line ]) {
            countRightAnswers++;
            answerState[ this.line ] = true;
        }
        if (countRightAnswers == numberOfRightAnswers) {
            console.log("YOU WIN!!!!");
        }    
    } else {
        this.texture = this.errorTextureButtonDown;
    }
    this.alpha = 1;
}

function onButtonUp() {
    this.isdown = false;
    if (!this.answer) {
        this.texture = this.textureButton;
    }
}

function onButtonOver() {
    // this.isOver = true;
    // if (this.isdown) {
    //     return;
    // }
    // this.texture = textureButtonOver;
}

function onButtonOut() {
    // this.isOver = false;
    // if (this.isdown) {
    //     return;
    // }
    // this.texture = textureButton;
}

// Consider that WIDTH and HEIGHT are defined as the width and height of your unresized game in pixels.
const WIDTH=800;
const HEIGHT=600;

/**
 * @param {PIXI.Application} app
 * @returns {Function}
 */
const resize = (app) =>  {
    return function () {
      const vpw = window.innerWidth;  // Width of the viewport
      const vph = window.innerHeight; // Height of the viewport
      let nvw; // New game width
      let nvh; // New game height
  
      // The aspect ratio is the ratio of the screen's sizes in different dimensions.
      // The height-to-width aspect ratio of the game is HEIGHT / WIDTH.
      
      if (vph / vpw < HEIGHT / WIDTH) {
        // If height-to-width ratio of the viewport is less than the height-to-width ratio
        // of the game, then the height will be equal to the height of the viewport, and
        // the width will be scaled.
        nvh = vph;
        nvw = (nvh * WIDTH) / HEIGHT;
      } else {
        // In the else case, the opposite is happening.
        nvw = vpw;
        nvh = (nvw * HEIGHT) / WIDTH;
      }
      
      // Set the game screen size to the new values.
      // This command only makes the screen bigger --- it does not scale the contents of the game.
      // There will be a lot of extra room --- or missing room --- if we don't scale the stage.
      app.renderer.resize(nvw, nvh);
      
      // This command scales the stage to fit the new size of the game.
      app.stage.scale.set(nvw / WIDTH, nvh / HEIGHT);

      console.log("RESIZING...");
    };
  }
  
  // Perform initial resizing
  resize(app)();
  // Add event listener so that our resize function runs every time the
  // browser window is resized.
  window.addEventListener("resize", resize(app));