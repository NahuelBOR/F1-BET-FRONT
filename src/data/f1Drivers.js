export const F1_DRIVERS = [
  { id: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', teamId: 'redbull', number: 1 },
  { id: 'TSU', name: 'Yuki Tsunoda', team: 'RB F1 Team', teamId: 'vcarb', number: 22 },
  { id: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', teamId: 'ferrari', number: 16 },
  { id: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', teamId: 'mercedes', number: 44 },
  { id: 'ANT', name: 'Andrea Kimi Antonelli', team: 'Mercedes', teamId: 'mercedes', number: 12 },
  { id: 'RUS', name: 'George Russell', team: 'Mercedes', teamId: 'mercedes', number: 63 },
  { id: 'NOR', name: 'Lando Norris', team: 'McLaren', teamId: 'mclaren', number: 4 },
  { id: 'PIA', name: 'Oscar Piastri', team: 'McLaren', teamId: 'mclaren', number: 81 },
  { id: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', teamId: 'astonmartin', number: 14 },
  { id: 'STR', name: 'Lance Stroll', team: 'Aston Martin', teamId: 'astonmartin', number: 18 },
  { id: 'GAS', name: 'Pierre Gasly', team: 'Alpine', teamId: 'alpine', number: 10 },
  { id: 'COL', name: 'Franco Colapinto', team: 'Williams', teamId: 'williams', number: 43 },
  { id: 'HAD', name: 'Isack Hadjar', team: 'RB F1 Team', teamId: 'vcarb', number: 6 },
  { id: 'LAW', name: 'Liam Lawson', team: 'Red Bull Racing', teamId: 'redbull', number: 30 },
  { id: 'HUL', name: 'Nico Hülkenberg', team: 'Kick Sauber', teamId: 'sauber', number: 27 },
  { id: 'BOR', name: 'Gabriel Bortoleto', team: 'Kick Sauber', teamId: 'sauber', number: 5 },
  { id: 'OCO', name: 'Esteban Ocon', team: 'Haas', teamId: 'haas', number: 31 },
  { id: 'BEA', name: 'Oliver Bearman', team: 'Haas', teamId: 'haas', number: 87 },
  { id: 'ALB', name: 'Alexander Albon', team: 'Williams', teamId: 'williams', number: 23 },
  { id: 'SAI', name: 'Carlos Sainz', team: 'Williams', teamId: 'williams', number: 55 },
];

export const F1_DRIVER_NAMES = F1_DRIVERS.map((driver) => driver.name);

export default F1_DRIVERS;
