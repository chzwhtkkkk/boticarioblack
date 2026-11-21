import { useState } from 'react'

const Settings = () => {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleTestConnection = async () => {
    if (!webhookUrl.trim()) {
      alert('Por favor, insira a URL do webhook')
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/dialog/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      setTestResult({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        response: data.response
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Integrações e configurações do sistema</p>
          </div>

          {/* DiaLOG Integration */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Integração DiaLOG Rastreios
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://...supabase.co/functions/v1/webhook-checkout/universal/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole a URL única fornecida pelo DiaLOG
              </p>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing || !webhookUrl.trim()}
              className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Testando conexão...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Testar Conexão</span>
                </>
              )}
            </button>

            {/* Test Result */}
            {testResult && (
              <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {testResult.success ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
                      {testResult.success ? 'Conexão bem-sucedida!' : 'Erro na conexão'}
                    </h3>
                    <p className={`text-sm mb-2 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {testResult.message}
                    </p>
                    {testResult.statusCode && (
                      <p className="text-xs text-gray-600 mb-1">
                        Status Code: <span className="font-mono font-semibold">{testResult.statusCode}</span>
                      </p>
                    )}
                    {testResult.response && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                          Ver resposta completa
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {testResult.response}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Como funciona:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>A URL é enviada automaticamente quando um pagamento for aprovado</li>
                  <li>O DiaLOG processa o pedido e envia email de rastreamento ao cliente</li>
                  <li>Logs de envio ficam salvos no sistema para auditoria</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
