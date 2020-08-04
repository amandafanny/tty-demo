// var tty = require('tty')
// var ttys = require('ttys')
var readline = require('readline');
const { stdin, stdout } = require('process');

// var stdin = ttys.stdin;
// var stdout = ttys.stdout;


// stdout.write('Hello Word!\n')
// stdout.write('\033[1A')
// stdout.write('winter')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// async function ask(question) {
//   return new Promise(resolve => {
//     rl.question(question, (answer) => {
//       resolve(answer)
//     });
//   })
// }

stdin.setRawMode(true)
stdin.resume();
stdin.setEncoding('utf-8')

async function getChar() {
  return new Promise(resolve => {
    stdin.once('data', function(key) {
      resolve(key)
    })
  })
}

function up(n = 1) {
  stdout.write('\033['+n+'A')
}
function down(n = 1) {
  stdout.write('\033['+n+'B')
}

function right(n = 1) {
  stdout.write('\033['+n+'C')
}

function left(n = 1) {
  stdout.write('\033['+n+'D')
}



async function select(choices) {
  let selected = 0;
  for(let i = 0; i < choices.length; i++) {
    const choice = choices[i]
    if (i === selected) {
      stdout.write('[x] '+choice+'\n')
    } else {
      stdout.write('[ ] '+choice+'\n')
    }
  }
  up(choices.length)
  right();
  while(true) {
    let char = await getChar();
    if (char === '\u0003') {
      process.exit();
    }
    if(char === 'w' && selected > 0) {
      left();
      stdout.write(' ');
      left();
      selected--;
      up();
      stdout.write('x');
      left();
    }
    if(char === 's' && selected < choices.length - 1) {
      left();
      stdout.write(' ');
      left();
      selected++;
      down();
      stdout.write('x');
      left();
    }
    if (char === '\r') {
      down(choices.length - selected);
      left();
      return choices[selected]
    }
  }
}

void async function() {
  // console.log(await ask('you name?'))
  stdout.write('which framework do you want to use ?\n')
  let answer = await select(['vue', 'react', 'angular'])
  stdout.write(`you choice ${answer}\n`)
  process.exit();
}()