import { useState } from 'react'
import './VehicleInput.css'

export default function VehicleInput({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    maxWeight: '',
    maxVolume: '',
    costPerKm: '',
    hourlyRate: '',
    fuelCost: '',
  })

  const [vehicles, setVehicles] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.name) {
      alert('Bitte Fahrzeugname eingeben')
      return
    }
    const newVehicle = {
      ...formData,
      id: Date.now(),
      maxWeight: parseFloat(formData.maxWeight) || 0,
      maxVolume: parseFloat(formData.maxVolume) || 0,
      costPerKm: parseFloat(formData.costPerKm) || 0,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      fuelCost: parseFloat(formData.fuelCost) || 0,
    }
    setVehicles([...vehicles, newVehicle])
    setFormData({
      name: '',
      maxWeight: '',
      maxVolume: '',
      costPerKm: '',
      hourlyRate: '',
      fuelCost: '',
    })
  }

  const handleSelect = (vehicle) => {
    onSubmit(vehicle)
  }

  return (
    <div className="vehicle-input">
      <h2>Fahrzeug-Datenblatt</h2>

      <form onSubmit={handleAdd} className="input-form">
        <div className="form-group">
          <label>Fahrzeug Name/Kennzeichen</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="z.B. LKW-001"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Max. Gewicht (kg)</label>
            <input
              type="number"
              name="maxWeight"
              value={formData.maxWeight}
              onChange={handleChange}
              placeholder="z.B. 2500"
            />
          </div>
          <div className="form-group">
            <label>Max. Volumen (m³)</label>
            <input
              type="number"
              name="maxVolume"
              value={formData.maxVolume}
              onChange={handleChange}
              placeholder="z.B. 10"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kosten pro km (€)</label>
            <input
              type="number"
              name="costPerKm"
              value={formData.costPerKm}
              onChange={handleChange}
              placeholder="z.B. 1.50"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Stundenhonorar (€/h)</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              placeholder="z.B. 50"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Treibstoffkosten (€/Liter)</label>
          <input
            type="number"
            name="fuelCost"
            value={formData.fuelCost}
            onChange={handleChange}
            placeholder="z.B. 1.80"
            step="0.01"
          />
        </div>

        <button type="submit" className="btn-primary">
          Fahrzeug hinzufügen
        </button>
      </form>

      {vehicles.length > 0 && (
        <div className="vehicles-list">
          <h3>Verfügbare Fahrzeuge</h3>
          <div className="vehicles-grid">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <h4>{vehicle.name}</h4>
                <div className="vehicle-details">
                  <p>📦 Gewicht: {vehicle.maxWeight} kg</p>
                  <p>📐 Volumen: {vehicle.maxVolume} m³</p>
                  <p>🛣️ Kosten/km: {vehicle.costPerKm.toFixed(2)} €</p>
                  <p>⏱️ Stundenhonorar: {vehicle.hourlyRate.toFixed(2)} €</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => handleSelect(vehicle)}
                >
                  Auswählen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
