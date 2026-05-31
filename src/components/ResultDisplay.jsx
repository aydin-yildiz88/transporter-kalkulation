import './ResultDisplay.css'

export default function ResultDisplay({ vehicle, calculations }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  return (
    <div className="result-display">
      <h2>📊 Kalkulationsergebnis</h2>

      <div className="results-grid">
        <div className="result-card highlight">
          <h3>Gesamtpreis</h3>
          <div className="big-number">
            {formatCurrency(calculations.totalPrice)}
          </div>
          <p className="subtitle">Kundenzuschlag: {calculations.marginPercent}%</p>
        </div>

        <div className="result-card">
          <h3>Basiskosten</h3>
          <div className="amount">
            {formatCurrency(calculations.baseCost)}
          </div>
        </div>

        <div className="result-card">
          <h3>Gewinnmarge</h3>
          <div className="amount margin-amount">
            +{formatCurrency(calculations.marginAmount)}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>💰 Nebenrechnungen (Kostenaufschlüsselung)</h3>
        <div className="cost-breakdown">
          <div className="breakdown-item">
            <span>Kilometerkosts:</span>
            <span className="amount">{formatCurrency(calculations.distanceCost)}</span>
          </div>
          <div className="breakdown-item">
            <span>Fahrthonorar (Stunden):</span>
            <span className="amount">{formatCurrency(calculations.hourlyCost)}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>📈 Auslastung</h3>
        <div className="utilization-grid">
          <div className="util-item">
            <label>Gewicht-Auslastung</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(calculations.utilization.weight, 100)}%`,
                }}
              />
            </div>
            <span>{calculations.utilization.weight}%</span>
          </div>
          <div className="util-item">
            <label>Volumen-Auslastung</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(calculations.utilization.volume, 100)}%`,
                }}
              />
            </div>
            <span>{calculations.utilization.volume}%</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>🔀 Split-Satz (Kostenaufteilung)</h3>
        <div className="split-info">
          <p><strong>Methode:</strong> {calculations.splitCalculation.type}</p>
          {calculations.splitCalculation.distanceShare !== undefined && (
            <div className="split-breakdown">
              <div className="split-item">
                <span>Kilometer-Anteil:</span>
                <span>{calculations.splitCalculation.distanceShare}%</span>
              </div>
              <div className="split-item">
                <span>Stunden-Anteil:</span>
                <span>{calculations.splitCalculation.hourlyShare}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>📋 Fahrzeug-Info</h3>
        <div className="vehicle-info">
          <div className="info-row">
            <span>Fahrzeug:</span>
            <strong>{vehicle.name}</strong>
          </div>
          <div className="info-row">
            <span>Max. Gewicht:</span>
            <strong>{vehicle.maxWeight} kg</strong>
          </div>
          <div className="info-row">
            <span>Max. Volumen:</span>
            <strong>{vehicle.maxVolume} m³</strong>
          </div>
          <div className="info-row">
            <span>Kosten/km:</span>
            <strong>{formatCurrency(vehicle.costPerKm)}</strong>
          </div>
          <div className="info-row">
            <span>Stundenhonorar:</span>
            <strong>{formatCurrency(vehicle.hourlyRate)}</strong>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={() => window.print()}>
          🖨️ Drucken
        </button>
        <button className="btn-secondary" onClick={() => {
          const data = {
            vehicle,
            calculations,
            timestamp: new Date().toLocaleString('de-DE'),
          }
          const element = document.createElement('a')
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)))
          element.setAttribute('download', `kalkulation-${vehicle.name}-${Date.now()}.json`)
          element.style.display = 'none'
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
        }}>
          💾 Als JSON speichern
        </button>
      </div>
    </div>
  )
}
