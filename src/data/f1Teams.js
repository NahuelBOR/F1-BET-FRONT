// frontend/src/data/f1Teams.js

// Colores basados en los equipos de F1.
// Los colores 'main' serán para la Navbar, y 'light'/'dark' (opcional) para otros acentos.
// Puedes ajustar estos códigos hexadecimales a tu gusto.
const F1_TEAMS = [
    {
        id: 'mercedes',
        name: 'Mercedes-AMG Petronas F1 Team',
        primaryColor: '#00A19C', // Plata/Turquesa
        secondaryColor: '#FFFFFF', // Blanco
        logo: '/logos/mercedes_logo.png' // Opcional: para futuros logos
    },
    {
        id: 'redbull',
        name: 'Oracle Red Bull Racing',
        primaryColor: '#3671C6', // Azul oscuro
        secondaryColor: '#FCF301', // Amarillo
        logo: '/logos/redbull_logo.png'
    },
    {
        id: 'ferrari',
        name: 'Scuderia Ferrari',
        primaryColor: '#ED1C24', // Rojo Ferrari
        secondaryColor: '#FFFFFF', // Blanco
        logo: '/logos/ferrari_logo.png'
    },
    {
        id: 'mclaren',
        name: 'McLaren Formula 1 Team',
        primaryColor: '#FF8700', // Naranja Papaya
        secondaryColor: '#47C2F0', // Azul cielo
        logo: '/logos/mclaren_logo.png'
    },
    {
        id: 'astonmartin',
        name: 'Aston Martin Aramco F1 Team',
        primaryColor: '#006F62', // Verde Aston Martin
        secondaryColor: '#B6B6B6', // Plata
        logo: '/logos/astonmartin_logo.png'
    },
    {
        id: 'alpine',
        name: 'BWT Alpine F1 Team',
        primaryColor: '#F282B4', // Roza Alpine
        secondaryColor: '#FF80B6', // Rosa BWT
        logo: '/logos/alpine_logo.png'
    },
    {
        id: 'williams',
        name: 'Williams Racing',
        primaryColor: '#005AFF', // Azul Williams
        secondaryColor: '#00C3FF', // Azul claro
        logo: '/logos/williams_logo.png'
    },
    {
        id: 'vcarb',
        name: 'Visa Cash App RB F1 Team',
        primaryColor: '#6692FF', // Azul claro/Blanco
        secondaryColor: '#FFFFFF',
        logo: '/logos/vcarb_logo.png'
    },
    {
        id: 'sauber',
        name: 'Stake F1 Team Kick Sauber',
        primaryColor: '#52E252', // Verde neón
        secondaryColor: '#000000', // Negro
        logo: '/logos/sauber_logo.png'
    },
    {
        id: 'haas',
        name: 'MoneyGram Haas F1 Team',
        primaryColor: '#B6B6B6', // Gris oscuro
        secondaryColor: '#FFFFFF', // Blanco
        logo: '/logos/haas_logo.png'
    },
    {
        id: 'default', // Opción por defecto o para usuarios sin preferencia
        name: 'Tema por defecto (Rojo F1)',
        primaryColor: '#E10600',
        secondaryColor: '#FFFFFF',
        logo: '/logos/f1_logo.png'
    }
];

export default F1_TEAMS;