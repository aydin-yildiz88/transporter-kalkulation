import { useState } from 'react'
import './CalculationForm.css'

export default function CalculationForm({ vehicle, onCalculate }) {
  const [formData, setFormData] = useState({
    distance: '',
    hours: '',
    weight: '',
    volume: '',
    serviceType: 'distance', // distance, hourly, weight, volume
    margin: '20',
    splitType: 'distance', // Aufteilungsart für Split-Sätze
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateCosts = () => {
    let baseCost
    const distance = parseFloat(formData.distance) || 0
    const hours = parseFloat(formData.hours) || 0
    const weight = parseFloat(formData.weight) || 0
    const volume = parseFloat(formData.volume) || 0
    const margin = parseFloat(formData.margin) || 0

    // Nebenrechnungen - Kostenberechnung
    const costs = {
      distanceCost: distance * vehicle.costPerKm,
      hourlyCost: hours * vehicle.hourlyRate,
      weightCost: 0,
      volumeCost: 0,
      utilization: {
        weight: weight > 0 ? (weight / vehicle.maxWeight * 100).toFixed(1) : 0,
        volume: volume > 0 ? (volume / vehicle.maxVolume * 100).toFixed(1) : 0,
      }
    }

    // Split-Satz Berechnung
    const splitCalculation = calculateSplitRates(costs, formData.splitType)

    // Basiskosten nach Servicetyp
    switch (formData.serviceType) {
      case 'distance':
        baseCost = costs.distanceCost
        break
      case 'hourly':
        baseCost = costs.hourlyCost
        break
      case 'weight':
        baseCost = (weight / 1000) * 50 // 50€ pro 1000kg beispiel
        break
      case 'volume':
        baseCost = (volume / 1) * 30 // 30€ pro m³ beispiel
        break
      case 'mixed':
        // Gemischte Berechnung: Gewicht + Volumen kombinieren
        baseCost = costs.distanceCost + (weight / 1000) * 50 + (volume / 1) * 30
        break
      default:
        baseCost = costs.distanceCost
    }

    // Gesamtkosten mit Margin
    const marginAmount = baseCost * (margin / 100)
    const totalPrice = baseCost + marginAmount

    return {
      ...costs,
      baseCost,
      marginAmount,
      totalPrice,
      marginPercent: margin,
      splitCalculation,
    }
  }

  const calculateSplitRates = (costs, splitType) => {
    const totalCost = costs.distanceCost + costs.hourlyCost

    if (splitType === 'distance') {
      return {
        type: 'Nach Kilometer',
        distanceShare: 100,
        hourlyShare: 0,
      }
    } else if (splitType === 'hourly') {
      return {
        type: 'Nach Stunden',
        distanceShare: 0,
        hourlyShare: 100,
      }
    } else if (splitType === 'mixed') {
      const distanceShare = totalCost > 0 ? (costs.distanceCost / totalCost * 100).toFixed(1) : 0
      const hourlyShare = totalCost > 0 ? (costs.hourlyCost / totalCost * 100).toFixed(1) : 0
      return {
        type: 'Gemischt (Auto)',
        distanceShare,
        hourlyShare,
      }
    } else if (splitType === 'weight') {
      return {
        type: 'Nach Gewicht',
        weightShare: 100,
      }
    }
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    const results = calculateCosts()
    onCalculate(results)
  }

  return (
    <div className="calculation-form">
      <h2>Auftragskalkulation</h2>

      <form onSubmit={handleCalculate}>
        <div className="form-section">
          <h3>Auftrags-Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Service-Typ</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
              >
                <option value="distance">Nach Kilometer</option>
                <option value="hourly">Nach Stunden</option>
                <option value="weight">Nach Gewicht</option>
                <option value="volume">Nach Volumen</option>
                <option value="mixed">Gemischt (Km + Gewicht + Volumen)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Aufteilungs-Satz</label>
              <select
                name="splitType"
                value={formData.splitType}
                onChange={handleChange}
              >
                <option value="distance">Kilometer-Basis</option>
                <option value="hourly">Stunden-Basis</option>
                <option value="mixed">Automatisch (Gemischt)</option>
                <option value="weight">Gewicht-Basis</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Distanz (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Fahrzeit (h)</label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gewicht (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Volumen (m³)</label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Kalkulation</h3>

          <div className="form-group">
            <label>Gewinnmarge (%)</label>
            <input
              type="number"
              name="margin"
              value={formData.margin}
              onChange={handleChange}
              placeholder="20"
              step="1"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary btn-large">
          Auftrag berechnen
        </button>
      </form>
    </div>
  )
}
