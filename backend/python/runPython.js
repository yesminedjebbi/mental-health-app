
const { spawn } = require('child_process');
const path = require('path');

function runModel(features) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, 'predictor.py');
    const python = spawn('python', [pythonScriptPath]);

    let result = '';

    // Récupération de la sortie
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    // En cas d'erreur
    python.stderr.on('data', (data) => {
      console.error(`Erreur dans le script Python : ${data}`);
    });

    // Quand le script Python se termine
    python.on('close', (code) => {
      try {
        const jsonResult = JSON.parse(result);
        resolve(jsonResult); // ✅ Résoudre la Promise avec le résultat JSON
      } catch (error) {
        reject(`Erreur JSON.parse: ${error}`);
      }
    });

    // Envoyer les features au script Python
    const inputData = JSON.stringify(features);
    python.stdin.write(inputData);
    python.stdin.end();
  });
}

module.exports = runModel;
