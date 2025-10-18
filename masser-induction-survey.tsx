import React, { useState } from 'react';
import { CheckCircle, Download, AlertCircle } from 'lucide-react';

const MasserSurvey = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: { step1: '', step2: '', step3: '', step4: '', step5: '' },
    q7: {
      biologico: false,
      fisico: false,
      quimico: false,
      fisicoQuimico: false,
      psicosocial: false,
      biomecanico: false,
      condicionesSeguridad: false,
      fenomenosNaturales: false
    },
    q8: ['', '', ''],
    q9: '',
    residuos1: '',
    residuos2: '',
    residuos3: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const correctAnswers = {
    q1: 'A',
    q2: 'D',
    q3: 'A',
    q4: 'B',
    q9: 'B',
    q6: {
      step1: '1',
      step2: '2',
      step3: '3',
      step4: '4',
      step5: '5'
    },
    q7: {
      biologico: true,
      fisico: true,
      quimico: true,
      fisicoQuimico: true,
      psicosocial: true,
      biomecanico: true,
      condicionesSeguridad: true,
      fenomenosNaturales: true
    },
    residuos1: 'c',
    residuos2: 'b',
    residuos3: 'b'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQ6Change = (step, value) => {
    setFormData(prev => ({
      ...prev,
      q6: { ...prev.q6, [step]: value }
    }));
  };

  const handleQ7Change = (risk) => {
    setFormData(prev => ({
      ...prev,
      q7: { ...prev.q7, [risk]: !prev.q7[risk] }
    }));
  };

  const handleQ8Change = (index, value) => {
    const newQ8 = [...formData.q8];
    newQ8[index] = value;
    setFormData(prev => ({ ...prev, q8: newQ8 }));
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    ['q1', 'q2', 'q3', 'q4', 'q9', 'residuos1', 'residuos2', 'residuos3'].forEach(q => {
      total++;
      if (formData[q] === correctAnswers[q]) correct++;
    });

    total++;
    const q6Correct = Object.keys(correctAnswers.q6).every(
      step => formData.q6[step] === correctAnswers.q6[step]
    );
    if (q6Correct) correct++;

    total++;
    const q7Correct = Object.keys(correctAnswers.q7).every(
      risk => formData.q7[risk] === correctAnswers.q7[risk]
    );
    if (q7Correct) correct++;

    return { correct, total, percentage: ((correct / total) * 100).toFixed(1) };
  };

  const generatePDF = () => {
    const score = calculateScore();
    const pdfContent = `
ENCUESTA DE INDUCCIÓN - MASSER
Seguridad y Salud en el Trabajo
====================================

INFORMACIÓN DEL EMPLEADO
Nombre: ${formData.employeeName || 'No proporcionado'}
ID: ${formData.employeeId || 'No proporcionado'}
Fecha: ${new Date().toLocaleDateString('es-CO')}

====================================
RESULTADOS
====================================
Puntaje: ${score.correct}/${score.total}
Porcentaje: ${score.percentage}%

====================================
RESPUESTAS DETALLADAS
====================================

1. Responsabilidad del trabajador en SST
   Respuesta: ${formData.q1 || 'Sin respuesta'}
   Correcta: ${correctAnswers.q1}
   ${formData.q1 === correctAnswers.q1 ? '✓ CORRECTA' : '✗ INCORRECTA'}

2. Comités existentes en MASSER
   Respuesta: ${formData.q2 || 'Sin respuesta'}
   Correcta: ${correctAnswers.q2}
   ${formData.q2 === correctAnswers.q2 ? '✓ CORRECTA' : '✗ INCORRECTA'}

3. ARL a la que pertenece
   Respuesta: ${formData.q3 || 'Sin respuesta'}
   Correcta: ${correctAnswers.q3}
   ${formData.q3 === correctAnswers.q3 ? '✓ CORRECTA' : '✗ INCORRECTA'}

4. Reporte de incidentes
   Respuesta: ${formData.q4 || 'Sin respuesta'}
   Correcta: ${correctAnswers.q4}
   ${formData.q4 === correctAnswers.q4 ? '✓ CORRECTA' : '✗ INCORRECTA'}

5. Prevención de accidentes (Respuesta abierta)
   ${formData.q5 || 'Sin respuesta'}

6. Pasos en caso de accidente (orden)
   Guarde la calma: ${formData.q6.step1}
   Informe al jefe inmediato: ${formData.q6.step2}
   Comuníquese con la ARL: ${formData.q6.step3}
   Primeros auxilios: ${formData.q6.step4}
   Traslade a IPS: ${formData.q6.step5}
   ${Object.keys(correctAnswers.q6).every(s => formData.q6[s] === correctAnswers.q6[s]) ? '✓ CORRECTA' : '✗ INCORRECTA'}

7. Riesgos en el puesto de trabajo
   Biológico: ${formData.q7.biologico ? 'Sí' : 'No'}
   Físico: ${formData.q7.fisico ? 'Sí' : 'No'}
   Químico: ${formData.q7.quimico ? 'Sí' : 'No'}
   Físico-Químico: ${formData.q7.fisicoQuimico ? 'Sí' : 'No'}
   Psicosocial: ${formData.q7.psicosocial ? 'Sí' : 'No'}
   Biomecánico: ${formData.q7.biomecanico ? 'Sí' : 'No'}
   Condiciones de seguridad: ${formData.q7.condicionesSeguridad ? 'Sí' : 'No'}
   Fenómenos naturales: ${formData.q7.fenomenosNaturales ? 'Sí' : 'No'}
   ${Object.keys(correctAnswers.q7).every(r => formData.q7[r] === correctAnswers.q7[r]) ? '✓ CORRECTA' : '✗ INCORRECTA'}

8. Elementos de protección personal (Respuesta abierta)
   1. ${formData.q8[0] || 'Sin respuesta'}
   2. ${formData.q8[1] || 'Sin respuesta'}
   3. ${formData.q8[2] || 'Sin respuesta'}

9. Comportamiento inseguro
   Respuesta: ${formData.q9 || 'Sin respuesta'}
   Correcta: ${correctAnswers.q9}
   ${formData.q9 === correctAnswers.q9 ? '✓ CORRECTA' : '✗ INCORRECTA'}

====================================
CLASIFICACIÓN DE RESIDUOS
====================================

1. Residuos derivados del aseo
   Respuesta: ${formData.residuos1 || 'Sin respuesta'}
   Correcta: ${correctAnswers.residuos1}
   ${formData.residuos1 === correctAnswers.residuos1 ? '✓ CORRECTA' : '✗ INCORRECTA'}

2. Recipientes de comida
   Respuesta: ${formData.residuos2 || 'Sin respuesta'}
   Correcta: ${correctAnswers.residuos2}
   ${formData.residuos2 === correctAnswers.residuos2 ? '✓ CORRECTA' : '✗ INCORRECTA'}

3. Importancia de separar residuos peligrosos
   Respuesta: ${formData.residuos3 || 'Sin respuesta'}
   Correcta: ${correctAnswers.residuos3}
   ${formData.residuos3 === correctAnswers.residuos3 ? '✓ CORRECTA' : '✗ INCORRECTA'}

====================================
FIN DEL REPORTE
====================================
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Encuesta_MASSER_${formData.employeeId || 'SinID'}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowNotification(true);
    generatePDF();
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const score = submitted ? calculateScore() : null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <span className="text-gray-400 text-sm">Logo MASSER</span>
            </div>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Encuesta Completada!</h2>
            <p className="text-gray-600">Los resultados han sido generados exitosamente</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white mb-6">
            <h3 className="text-2xl font-bold mb-2">Resultados</h3>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-4xl font-bold">{score.correct}/{score.total}</p>
                <p className="text-sm opacity-90">Respuestas correctas</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{score.percentage}%</p>
                <p className="text-sm opacity-90">Porcentaje</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Archivo descargado</p>
                <p className="text-xs text-blue-600 mt-1">
                  El PDF con tus resultados se ha descargado automáticamente. 
                  Revisa tu carpeta de descargas.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Realizar Nueva Encuesta
          </button>
        </div>

        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center animate-pulse z-50">
            <CheckCircle className="w-6 h-6 mr-3" />
            <div>
              <p className="font-bold">¡Encuesta realizada y enviada con éxito!</p>
              <p className="text-sm opacity-90">PDF generado correctamente</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6 md:p-8">
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-8 border-2 border-dashed border-gray-300">
          <span className="text-gray-400 text-sm">Inserte Logo MASSER aquí</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Encuesta de Inducción
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Seguridad y Salud en el Trabajo - MASSER
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Información del Empleado</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese su nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Identificación *
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese su número de cédula"
              />
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              1. ¿Cuál es mi responsabilidad como trabajador para el cumplimiento de la política de seguridad y salud en el trabajo de MASSER?
            </h3>
            <div className="space-y-2">
              {[
                { value: 'A', text: 'Cumplir con todas las normas e indicaciones de seguridad y salud en trabajo establecida y trabajar en conjunto con los jefes en la identificación, reporte y solución de situaciones inseguras.' },
                { value: 'B', text: 'Cumplir con mi horario de trabajo evitando llegar tarde.' },
                { value: 'C', text: 'Cumplir con lo establecido en el contrato de trabajo.' },
                { value: 'D', text: 'Evitar hacerles bromas a mis compañeros.' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    value={option.value}
                    checked={formData.q1 === option.value}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    required
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option.value}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              2. Seleccione dentro de las posibilidades los comités que existen actualmente en MASSER
            </h3>
            <div className="space-y-2">
              {[
                { value: 'A', text: 'Comité de pánico y comité de atentados a empleados' },
                { value: 'B', text: 'Comité de primeros auxilios y comité de revisión ambiental.' },
                { value: 'C', text: 'Comité de seguridad y comité de gestión social.' },
                { value: 'D', text: 'Comité paritario de seguridad y salud en el trabajo y comité de convivencia laboral.' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="q2"
                    value={option.value}
                    checked={formData.q2 === option.value}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    required
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option.value}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              3. ¿Cuál es la ARL a la cual usted pertenece?
            </h3>
            <div className="space-y-2">
              {[
                { value: 'A', text: 'Bolívar' },
                { value: 'B', text: 'Liberty' },
                { value: 'C', text: 'Sura' },
                { value: 'D', text: 'Colpatria' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="q3"
                    value={option.value}
                    checked={formData.q3 === option.value}
                    onChange={(e) => handleInputChange('q3', e.target.value)}
                    required
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option.value}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              4. En caso de un incidente debe reportar inmediatamente a:
            </h3>
            <div className="space-y-2">
              {[
                { value: 'A', text: 'El compañero' },
                { value: 'B', text: 'El jefe inmediato' },
                { value: 'C', text: 'El vigilante' },
                { value: 'D', text: 'El almacén' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="q4"
                    value={option.value}
                    checked={formData.q4 === option.value}
                    onChange={(e) => handleInputChange('q4', e.target.value)}
                    required
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option.value}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              5. ¿Cómo puedo ayudar desde mi puesto de trabajo a la prevención de accidentes de trabajo?
            </h3>
            <textarea
              value={formData.q5}
              onChange={(e) => handleInputChange('q5', e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Escriba su respuesta aquí..."
            />
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              6. Coloque la numeración correspondiente del 1 al 5 según sea necesario, de acuerdo al paso a paso en caso de presentarse un accidente
            </h3>
            <div className="space-y-3">
              {[
                { key: 'step1', text: 'Guarde la calma' },
                { key: 'step2', text: 'Informe inmediatamente a su jefe inmediato' },
                { key: 'step3', text: 'Comuníquese con la ARL' },
                { key: 'step4', text: 'Brinde atención en primeros auxilios al trabajador en el sitio de ocurrencia' },
                { key: 'step5', text: 'Traslade al trabajador a la institución de salud IPS para atención médica' }
              ].map(step => (
                <div key={step.key} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                  <select
                    value={formData.q6[step.key]}
                    onChange={(e) => handleQ6Change(step.key, e.target.value)}
                    required
                    className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <span className="text-gray-700">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              7. Marque con una X los riesgos a los cuales me voy a ver expuesto en mi sitio de trabajo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'biologico', text: 'Biológico' },
                { key: 'fisico', text: 'Físico' },
                { key: 'quimico', text: 'Químico' },
                { key: 'fisicoQuimico', text: 'Físico-Químico' },
                { key: 'psicosocial', text: 'Psicosocial' },
                { key: 'biomecanico', text: 'Biomecánico' },
                { key: 'condicionesSeguridad', text: 'Condiciones de seguridad' },
                { key: 'fenomenosNaturales', text: 'Fenómenos naturales' }
              ].map(risk => (
                <label key={risk.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.q7[risk.key]}
                    onChange={() => handleQ7Change(risk.key)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">{risk.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              8. Nombre tres de los elementos de protección personal que debe utilizar en su puesto de trabajo
            </h3>
            <div className="space-y-3">
              {[0, 1, 2].map(index => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Elemento {index + 1}
                  </label>
                  <input
                    type="text"
                    value={formData.q8[index]}
                    onChange={(e) => handleQ8Change(index, e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Elemento de protección ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-3">
              9. ¿Qué es un comportamiento inseguro?
            </h3>
            <div className="space-y-2">
              {[
                { value: 'A', text: 'Es cuando el trabajador atiende todas las solicitudes realizadas por el jefe inmediato.' },
                { value: 'B', text: 'Se refiere a todas las acciones y decisiones humanas, que pueden causar una situación insegura o accidente, con consecuencias para el trabajador, la producción, el medio ambiente y otras personas.' },
                { value: 'C', text: 'En acatar todas las órdenes que imparten mis compañeros.' },
                { value: 'D', text: 'Es evitar al máximo mis llegadas tarde a mi sitio de trabajo.' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="q9"
                    value={option.value}
                    checked={formData.q9 === option.value}
                    onChange={(e) => handleInputChange('q9', e.target.value)}
                    required
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option.value}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Cuestionario - Clasificación de Residuos
            </h2>

            <div className="border-l-4 border-green-500 pl-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">
                ¿En qué tipo de caneca deben depositarse los residuos derivados del aseo, como servilletas usadas o papel higiénico?
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'a', text: 'Caneca blanca' },
                  { value: 'b', text: 'Caneca verde' },
                  { value: 'c', text: 'Caneca negra' },
                  { value: 'd', text: 'Caneca roja' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="residuos1"
                      value={option.value}
                      checked={formData.residuos1 === option.value}
                      onChange={(e) => handleInputChange('residuos1', e.target.value)}
                      required
                    />
                    <span className="text-gray-700">{option.value}) {option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">
                Los recipientes de comidas con restos de grasa o alimentos se consideran:
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'a', text: 'Residuos aprovechables' },
                  { value: 'b', text: 'Residuos no aprovechables' },
                  { value: 'c', text: 'Residuos peligrosos' },
                  { value: 'd', text: 'Residuos orgánicos' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="residuos2"
                      value={option.value}
                      checked={formData.residuos2 === option.value}
                      onChange={(e) => handleInputChange('residuos2', e.target.value)}
                      required
                    />
                    <span className="text-gray-700">{option.value}) {option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-3">
                ¿Por qué es importante separar correctamente los residuos peligrosos como el aceite usado o los tóners?
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'a', text: 'Porque ocupan mucho espacio' },
                  { value: 'b', text: 'Porque pueden contaminar el ambiente y requieren manejo especial' },
                  { value: 'c', text: 'Porque se pueden reciclar fácilmente' },
                  { value: 'd', text: 'Porque tienen mal olor' }
                ].map(option => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 bg-white hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="residuos3"
                      value={option.value}
                      checked={formData.residuos3 === option.value}
                      onChange={(e) => handleInputChange('residuos3', e.target.value)}
                      required
                    />
                    <span className="text-gray-700">{option.value}) {option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-bold text-lg shadow-lg"
            >
              Enviar Encuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasserSurvey;