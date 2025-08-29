import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA & ENTITIES --- //

// Based on the 'Destination' schema
const mockDestinations = [
    {
        id: 1,
        name: "Bora Bora",
        country: "French Polynesia",
        description: "Experience the pinnacle of tropical luxury in overwater bungalows surrounded by turquoise lagoons.",
        image_url: "https://images.pexels.com/photos/375735/pexels-photo-375735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "island",
        price_from: 1200,
        rating: 4.9,
        popular: true,
    },
    {
        id: 2,
        name: "Kyoto",
        country: "Japan",
        description: "Wander through serene temples, vibrant shrines, and traditional geisha districts in Japan's cultural heart.",
        image_url: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "city",
        price_from: 800,
        rating: 4.8,
        popular: true,
    },
    {
        id: 3,
        name: "Swiss Alps",
        country: "Switzerland",
        description: "Conquer majestic peaks, ski down pristine slopes, and breathe in the crisp, clean mountain air.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        category: "mountain",
        price_from: 1500,
        rating: 4.9,
        popular: false,
    },
    {
        id: 4,
        name: "Santorini",
        country: "Greece",
        description: "Witness iconic sunsets over the Aegean Sea from stunning white-washed villages.",
        image_url: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "island",
        price_from: 950,
        rating: 4.8,
        popular: true,
    },
    {
        id: 5,
        name: "Machu Picchu",
        country: "Peru",
        description: "Explore the ancient Incan citadel set high in the Andes Mountains.",
        image_url: "https://images.pexels.com/photos/1647972/pexels-photo-1647972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "temple",
        price_from: 700,
        rating: 4.7,
        popular: false,
    },
    {
        id: 6,
        name: "Serengeti National Park",
        country: "Tanzania",
        description: "Embark on an unforgettable safari to witness the great wildebeest migration.",
        image_url: "https://images.pexels.com/photos/175782/pexels-photo-175782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "forest",
        price_from: 2500,
        rating: 4.9,
        popular: false,
    }
];

// Based on the 'Booking' schema
const mockBookings = [];

// Data Entities Simulation
const Destination = {
    list: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockDestinations;
    },
};

const Booking = {
    list: async (sortBy = '-created_date') => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simple sort simulation
        if (sortBy === '-created_date') {
            return [...mockBookings].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }
        return mockBookings;
    },
    create: async (bookingData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newBooking = {
            id: mockBookings.length + 1,
            created_date: new Date().toISOString(),
            status: 'confirmed', // Simulate instant confirmation
            ...bookingData,
        };
        mockBookings.push(newBooking);
        return newBooking;
    },
};


// --- SVG ICONS (lucide-react replacements) --- //

const Icon = ({ children, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const ChevronLeft = ({ className }) => <Icon className={className}><path d="m15 18-6-6 6-6" /></Icon>;
const ChevronRight = ({ className }) => <Icon className={className}><path d="m9 18 6-6-6-6" /></Icon>;
const Search = ({ className }) => <Icon className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
const Star = ({ className }) => <Icon className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>;
const Globe = ({ className }) => <Icon className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></Icon>;
const Shield = ({ className }) => <Icon className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></Icon>;
const Clock = ({ className }) => <Icon className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
const Plane = ({ className }) => <Icon className={className}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1.5-1.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></Icon>;
const Wifi = ({ className }) => <Icon className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></Icon>;
const Coffee = ({ className }) => <Icon className={className}><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" /></Icon>;
const Filter = ({ className }) => <Icon className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Icon>;
const ArrowLeft = ({ className }) => <Icon className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></Icon>;
const ArrowRight = ({ className }) => <Icon className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
const Users = ({ className }) => <Icon className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
const CreditCard = ({ className }) => <Icon className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></Icon>;
const CheckCircle = ({ className }) => <Icon className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
const XCircle = ({ className }) => <Icon className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></Icon>;
const AlertCircle = ({ className }) => <Icon className={className}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></Icon>;
const MapPin = ({ className }) => <Icon className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>;
const Calendar = ({ className }) => <Icon className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></Icon>;
const User = ({ className }) => <Icon className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
const Menu = ({ className }) => <Icon className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></Icon>;
const X = ({ className }) => <Icon className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;
const Building2 = ({ className }) => <Icon className={className}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></Icon>;
const Wind = ({ className }) => <Icon className={className}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></Icon>;
const Award = ({ className }) => <Icon className={className}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></Icon>;
const Check = ({ className }) => <Icon className={className}><polyline points="20 6 9 17 4 12" /></Icon>;
const CalendarIcon = Calendar;
const Car = ({ className }) => <Icon className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M7 17h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></Icon>;


// --- UI COMPONENT STUBS (shadcn/ui replacements) --- //

const Button = ({ children, className = "", ...props }) => {
    return <button className={`button ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className }) => <div className={`card ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`card-title ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`card-content ${className}`}>{children}</div>;
const Badge = ({ children, className }) => <span className={`badge ${className}`}>{children}</span>;
const Input = ({ className, ...props }) => <input className={`input ${className}`} {...props} />;


// --- CUSTOM UI COMPONENTS --- //

const DestinationCard = ({ destination, index, onBookNow }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="destination-card-motion"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onBookNow(destination)}
        >
            <div className="destination-card">
                <div className="destination-card-image-wrapper">
                    <motion.img
                        src={destination.image_url}
                        alt={destination.name}
                        className="destination-card-image"
                        animate={{ scale: isHovered ? 1.1 : 1,}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="destination-card-image-gradient" />
                </div>
                <div className="destination-card-content-wrapper">
                    <motion.div animate={{ y: isHovered ? -10 : 0 }} transition={{ duration: 0.3 }}>
                        <div className="destination-card-category">
                            {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                        </div>
                        <div className="destination-card-location">
                            <MapPin className="icon-xs" />
                            <span>{destination.country}</span>
                        </div>
                        <h3 className="destination-card-title">{destination.name}</h3>
                        <p className="destination-card-description">{destination.description}</p>
                        <div className="destination-card-bottom-row">
                            <div className="destination-card-details">
                                {destination.rating && (
                                    <div className="destination-card-rating">
                                        <Star className="icon-xs star-icon" />
                                        <span className="font-medium">{destination.rating}</span>
                                    </div>
                                )}
                                {destination.price_from && (
                                    <div>
                                        <span className="text-sm">From </span>
                                        <span className="font-bold">${destination.price_from}</span>
                                    </div>
                                )}
                            </div>
                            <motion.div
                                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Button size="sm" onClick={(e) => { e.stopPropagation(); onBookNow(destination); }} className="button-primary button-sm">
                                    Book Now
                                    <ArrowRight className="icon-xs" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                {destination.popular && (
                    <div className="destination-card-popular-badge">
                        POPULAR
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SearchForm = ({ onSearch, className = "" }) => {
    const [searchData, setSearchData] = useState({
        from: 'New York',
        to: 'Tokyo',
        departure: new Date().toISOString().slice(0, 10),
        return: '',
        passengers: 1,
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`search-form-motion ${className}`}
        >
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-form-grid">
                    <div className="search-form-field">
                        <label>From</label>
                        <div className="input-with-icon">
                          <Plane className="input-icon" />
                          <Input name="from" value={searchData.from} onChange={handleInputChange} placeholder="Departure" />
                        </div>
                    </div>
                    <div className="search-form-field">
                        <label>To</label>
                         <div className="input-with-icon">
                           <MapPin className="input-icon" />
                           <Input name="to" value={searchData.to} onChange={handleInputChange} placeholder="Arrival" />
                        </div>
                    </div>
                    <div className="search-form-field">
                        <label>Departure</label>
                        <Input name="departure" value={searchData.departure} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="search-form-field">
                        <label>Passengers</label>
                        <Input name="passengers" value={searchData.passengers} onChange={handleInputChange} type="number" min="1" />
                    </div>
                </div>
                <div className="search-form-button-container">
                    <Button type="submit" className="button-primary button-lg">
                        <Search className="icon-sm" />
                        Search
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

const HotelSearchForm = ({ onSearch, className = "" }) => {
    const [searchData, setSearchData] = React.useState({
        location: 'Tokyo, Japan',
        checkIn: new Date().toISOString().slice(0, 10),
        checkOut: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().slice(0, 10),
        guests: 2
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`search-form-motion ${className}`}
        >
            <form onSubmit={handleSubmit} className="search-form">
                <div className="hotel-search-form-grid">
                    <div className="search-form-field hotel-search-location">
                        <label>Location</label>
                        <div className="input-with-icon">
                            <MapPin className="input-icon" />
                            <Input name="location" value={searchData.location} onChange={handleInputChange} placeholder="e.g., Tokyo, Japan" />
                        </div>
                    </div>
                    <div className="search-form-field">
                        <label>Check-in</label>
                        <Input name="checkIn" value={searchData.checkIn} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="search-form-field">
                        <label>Check-out</label>
                        <Input name="checkOut" value={searchData.checkOut} onChange={handleInputChange} type="date" />
                    </div>
                </div>
                 <div className="search-form-button-container">
                    <Button type="submit" className="button-primary button-lg">
                        <Search className="icon-sm" />
                        Search
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

const HotelCard = ({ hotel, index }) => {
    const amenityIcons = { wifi: Wifi, pool: Wind, gym: Award, spa: Shield, restaurant: Coffee, parking: Car };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="hotel-card glass-effect hover-glow"
        >
            <div className="hotel-card-image-wrapper">
                <img src={hotel.image_url} alt={hotel.name} className="hotel-card-image" />
            </div>
            <div className="hotel-card-content">
                <div className="hotel-card-header">
                    <div>
                        <div className="hotel-card-location">
                            <MapPin className="icon-xs" />
                            {hotel.location}
                        </div>
                        <h3 className="hotel-card-title">{hotel.name}</h3>
                    </div>
                    <div className="hotel-card-rating">
                        <Star className="icon-xs star-icon" />
                        <span className="font-semibold">{hotel.rating}</span>
                    </div>
                </div>
                <p className="hotel-card-description">{hotel.description}</p>
                <div className="hotel-card-amenities">
                    {hotel.amenities.slice(0, 3).map(amenity => (
                        <Badge key={amenity} className="badge-secondary capitalize">
                            {React.createElement(amenityIcons[amenity] || Star, { className: 'icon-xxs' })}
                            {amenity}
                        </Badge>
                    ))}
                </div>
                <div className="hotel-card-footer">
                    <div>
                        <p className="price-label">from</p>
                        <p className="price">
                            ${hotel.price_per_night}
                            <span className="price-per-night">/night</span>
                        </p>
                    </div>
                    <Button className="button-primary">
                        View Deal
                        <ArrowRight className="icon-xs" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const SeatMap = ({ onSeatSelect, selectedSeats = [] }) => {
    const seatTypes = { economy: { price: 0 }, premium: { price: 150 }, business: { price: 500 } };
    
    const [seats] = React.useState(() => {
        const generatedSeats = [];
        for (let row = 1; row <= 3; row++) ['A', 'B', 'C', 'D'].forEach(letter => generatedSeats.push({ id: `${row}${letter}`, row, type: 'business', available: Math.random() > 0.3, price: seatTypes.business.price }));
        for (let row = 4; row <= 8; row++) ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => generatedSeats.push({ id: `${row}${letter}`, row, type: 'premium', available: Math.random() > 0.4, price: seatTypes.premium.price }));
        for (let row = 9; row <= 30; row++) ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => generatedSeats.push({ id: `${row}${letter}`, row, type: 'economy', available: Math.random() > 0.5, price: seatTypes.economy.price }));
        return generatedSeats;
    });

    const handleSeatClick = (seat) => {
        if (seat.available) onSeatSelect(seat);
    };

    const getSeatState = (seat) => {
        if (!seat.available) return 'occupied';
        if (selectedSeats.some(s => s.id === seat.id)) return 'selected';
        return 'available';
    };

    const SeatButton = ({ seat, state, ...props }) => {
        let stateClass = '';
        switch(state) {
            case 'available':
                stateClass = `seat-available seat-${seat.type}`;
                break;
            case 'selected':
                stateClass = `seat-selected seat-${seat.type}`;
                break;
            case 'occupied':
                stateClass = 'seat-occupied';
                break;
            default:
                break;
        }

        return (
            <motion.button
                className={`seat-button ${stateClass}`}
                onClick={() => handleSeatClick(seat)}
                disabled={state === 'occupied'}
                whileHover={state === 'available' ? { scale: 1.2 } : {}}
                whileTap={state === 'available' ? { scale: 0.95 } : {}}
            >
                {state === 'occupied' && <User className="icon-xxs" />}
                {state === 'selected' && <Check className="icon-sm" />}
            </motion.button>
        );
    }
    
    const renderSeatRow = (rowNumber) => {
        const rowSeats = seats.filter(seat => seat.row === rowNumber);
        const leftSeats = rowSeats.filter(seat => ['A', 'B', 'C'].includes(seat.id.slice(-1)));
        const rightSeats = rowSeats.filter(seat => ['D', 'E', 'F'].includes(seat.id.slice(-1)));
        
        return (
            <div key={rowNumber} className="seat-row">
                <div className="seat-row-number">{rowNumber}</div>
                <div className="seat-group"> {leftSeats.map(seat => <SeatButton key={seat.id} seat={seat} state={getSeatState(seat)} />)} </div>
                <div className="seat-aisle"></div>
                <div className="seat-group"> {rightSeats.map(seat => <SeatButton key={seat.id} seat={seat} state={getSeatState(seat)} />)} </div>
                <div className="seat-row-number">{rowNumber}</div>
            </div>
        );
    };
    
    return (
        <div className="seat-map-container glass-effect">
            <div className="seat-map-legend">
                <div className="legend-item"><div className="legend-box seat-economy"></div>Economy</div>
                <div className="legend-item"><div className="legend-box seat-premium"></div>Premium</div>
                <div className="legend-item"><div className="legend-box seat-business"></div>Business</div>
                <div className="legend-item"><div className="legend-box seat-occupied"></div>Occupied</div>
                <div className="legend-item"><div className="legend-box seat-selected-legend"></div>Selected</div>
            </div>
            <div className="seat-map-scroll">
                <h3 className="seat-class-header business-header">Business</h3>
                {[1, 2, 3].map(renderSeatRow)}
                <h3 className="seat-class-header premium-header">Premium</h3>
                {[4, 5, 6, 7, 8].map(renderSeatRow)}
                <h3 className="seat-class-header economy-header">Economy</h3>
                {Array.from({ length: 22 }, (_, i) => i + 9).map(renderSeatRow)}
            </div>
        </div>
    );
};


// --- PAGE COMPONENTS --- //

const LandingPage = ({ navigate }) => {
    const [destinations, setDestinations] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDestinations = async () => {
            setIsLoading(true);
            const data = await Destination.list();
            setDestinations(data);
            setIsLoading(false);
        };
        loadDestinations();
    }, []);

    const nextSlide = useCallback(() => {
        if (destinations.length > 0) {
            setCurrentSlide(prev => (prev + 1) % Math.min(destinations.length, 3));
        }
    }, [destinations.length]);

    const prevSlide = () => {
        if (destinations.length > 0) {
            setCurrentSlide(prev => (prev - 1 + Math.min(destinations.length, 3)) % Math.min(destinations.length, 3));
        }
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const handleSearch = () => navigate('Flights');
    const handleBookNow = () => navigate('Flights');

    return (
        <div className="page-container">
            <section className="hero-section">
                <AnimatePresence mode="wait">
                    {!isLoading && destinations.length > 0 && (
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="hero-background"
                        >
                            <img src={destinations[currentSlide]?.image_url} alt={destinations[currentSlide]?.name} className="hero-bg-image" />
                            <div className="hero-bg-gradient" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="hero-content-container">
                    <div className="hero-content">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
                            <h1 className="hero-title">
                                <span>Discover Your Next</span><br /><span className="text-gradient">Dream Destination</span>
                            </h1>
                            <p className="hero-subtitle">Embark on extraordinary journeys to the world's most breathtaking destinations.</p>
                        </motion.div>
                        <SearchForm onSearch={handleSearch} className="hero-search-form" />
                        {destinations[currentSlide] && (
                            <motion.div key={destinations[currentSlide].id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="featured-destination">
                                <p className="featured-destination-label">Featured Destination</p>
                                <h3 className="featured-destination-name">{destinations[currentSlide].name}</h3>
                                <p className="featured-destination-country">{destinations[currentSlide].country}</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="slider-controls">
                    <Button variant="ghost" size="icon" onClick={prevSlide} className="slider-button"><ChevronLeft className="icon-md" /></Button>
                    <div className="slider-indicators">
                        {destinations.slice(0, 3).map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`indicator ${index === currentSlide ? 'active' : ''}`} />
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextSlide} className="slider-button"><ChevronRight className="icon-md" /></Button>
                </div>
            </section>

            <section className="page-section">
                <div className="section-container">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-header">
                        <h2 className="section-title">Why Choose TripSpark?</h2>
                        <p className="section-subtitle">Experience the future of travel booking with our premium features and unmatched service.</p>
                    </motion.div>
                    <div className="features-grid">
                        {[
                            { icon: Search, title: "Smart Search", description: "AI-powered search finds the best deals across millions of flights and hotels in seconds." },
                            { icon: Shield, title: "Secure Booking", description: "Bank-level security and 24/7 support ensure your bookings are always protected." },
                            { icon: Clock, title: "Instant Confirmation", description: "Get instant confirmation and mobile tickets for hassle-free travel experiences." }
                        ].map((feature, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="feature-card glass-effect hover-glow group">
                                <div className="feature-icon-wrapper">
                                    <feature.icon className="feature-icon" />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section">
                <div className="section-container">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-header">
                        <h2 className="section-title">Popular Destinations</h2>
                        <p className="section-subtitle">Explore our handpicked selection of the world's most extraordinary places.</p>
                    </motion.div>
                    <div className="destinations-grid">
                        {destinations.slice(0, 6).map((destination, index) => (
                            <DestinationCard key={destination.id} destination={destination} index={index} onBookNow={handleBookNow} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const FlightsPage = ({ navigate }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const handleSearch = async () => {
        setIsSearching(true);
        setTimeout(() => {
            setSearchResults([
                { id: 1, airline: "SkyWings", departure: { time: "08:30", city: "New York", code: "JFK" }, arrival: { time: "20:15", city: "Tokyo", code: "NRT" }, duration: "14h 45m", stops: 1, price: 1299, class: "Economy", amenities: ["wifi", "meals"], rating: 4.5 },
                { id: 2, airline: "AeroLux", departure: { time: "14:20", city: "New York", code: "JFK" }, arrival: { time: "06:45", city: "Tokyo", code: "HND" }, duration: "13h 25m", stops: 0, price: 2499, class: "Business", amenities: ["wifi", "meals", "lounge"], rating: 4.8 },
                { id: 3, airline: "CloudJet", departure: { time: "11:15", city: "New York", code: "LGA" }, arrival: { time: "02:30", city: "Tokyo", code: "NRT" }, duration: "16h 15m", stops: 2, price: 899, class: "Economy", amenities: ["meals"], rating: 4.2 }
            ]);
            setIsSearching(false);
        }, 1500);
    };

    const handleSelectFlight = (flight) => {
        navigate('SeatSelection', { flight });
    };

    return (
        <div className="page-container page-padded">
            <div className="section-container">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="section-header">
                    <h1 className="section-title">Find Your Perfect Flight</h1>
                    <p className="section-subtitle">Search and compare flights from hundreds of airlines worldwide</p>
                </motion.div>
                <SearchForm onSearch={handleSearch} className="max-w-4xl mx-auto mb-12" />

                {isSearching && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-container">
                        <div className="spinner"></div>
                        <p>Searching for the best flights...</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="results-header">
                                <h2 className="results-title">{searchResults.length} flights found</h2>
                                <Button className="button-outline"><Filter className="icon-xs" />Filters</Button>
                            </div>
                            <div className="space-y-4">
                                {searchResults.map((flight, index) => (
                                    <motion.div key={flight.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flight-card glass-effect hover-glow">
                                        <div className="flight-card-main">
                                            <div className="flight-card-route">
                                                <div className="flight-time-location">
                                                    <div className="flight-time">{flight.departure.time}</div>
                                                    <div className="flight-city">{flight.departure.city}</div>
                                                    <div className="flight-code">{flight.departure.code}</div>
                                                </div>
                                                <div className="flight-path">
                                                    <div className="flight-path-line-container">
                                                        <div className="flight-path-line"></div>
                                                        <Plane className="flight-path-icon" />
                                                        <div className="flight-path-line"></div>
                                                    </div>
                                                    <div className="flight-duration">{flight.duration}</div>
                                                    <div className="flight-stops">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
                                                </div>
                                                <div className="flight-time-location text-right">
                                                    <div className="flight-time">{flight.arrival.time}</div>
                                                    <div className="flight-city">{flight.arrival.city}</div>
                                                    <div className="flight-code">{flight.arrival.code}</div>
                                                </div>
                                            </div>
                                            <div className="flight-card-separator"></div>
                                            <div className="flight-card-details">
                                                <div className="flight-card-airline-info">
                                                    <div className="flight-airline-name">{flight.airline}</div>
                                                    <div className="flight-airline-rating">
                                                        <Star className="icon-xs star-icon" />
                                                        <span>{flight.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="flight-card-price-action">
                                                    <div className="flight-price">${flight.price}</div>
                                                    <Button onClick={() => handleSelectFlight(flight)} className="button-primary">
                                                        Select Flight
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isSearching && searchResults.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="empty-state">
                        <Plane className="empty-state-icon" />
                        <h3 className="empty-state-title">Ready to take off?</h3>
                        <p className="empty-state-subtitle">Use the search form above to find your perfect flight</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const SeatSelectionPage = ({ navigate, pageData }) => {
    const flight = pageData?.flight;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        if (!flight) {
            navigate('Flights');
        }
    }, [flight, navigate]);

    if (!flight) return null;

    const handleSeatSelect = (seat) => {
        setSelectedSeats(prev => {
            const isSelected = prev.some(s => s.id === seat.id);
            return isSelected ? prev.filter(s => s.id !== seat.id) : [...prev, seat];
        });
    };

    const calculateTotalPrice = () => {
        const seatUpgrades = selectedSeats.reduce((total, seat) => total + seat.price, 0);
        return flight.price * (selectedSeats.length || 1) + seatUpgrades;
    };

    const handleBookNow = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        setIsBooking(true);
        try {
            await Booking.create({
                booking_type: "flight",
                destination: flight.arrival.city,
                departure_city: flight.departure.city,
                departure_date: new Date().toISOString().split('T')[0],
                passengers: selectedSeats.length,
                class: flight.class.toLowerCase(),
                total_price: calculateTotalPrice(),
                passenger_details: selectedSeats.map((seat, i) => ({ name: `Passenger ${i+1}`, seat: seat.id }))
            });
            navigate('Bookings');
        } catch (error) {
            console.error("Booking error:", error);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="page-container page-padded">
            <div className="section-container">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header-nav">
                    <Button variant="ghost" size="icon" onClick={() => navigate('Flights')} className="back-button"><ArrowLeft className="icon-sm" /></Button>
                    <div>
                        <h1 className="section-title">Select Your Seats</h1>
                        <p className="section-subtitle">Choose the perfect seats for your journey</p>
                    </div>
                </motion.div>
                <div className="seat-selection-layout">
                    <div className="seat-selection-map-area">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <SeatMap onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />
                        </motion.div>
                    </div>
                    <div className="seat-selection-sidebar">
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="summary-card glass-effect">
                            <h3 className="summary-title">Flight Details</h3>
                            <div className="summary-row"><span className="summary-label">Route</span>{flight.departure.code} <ArrowRight className="icon-xs"/> {flight.arrival.code}</div>
                            <div className="summary-row"><span className="summary-label">Airline</span>{flight.airline}</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="summary-card glass-effect">
                            <h3 className="summary-title icon-title"><Users className="icon-sm" />Selected Seats</h3>
                            {selectedSeats.length > 0 ? (
                                <div className="selected-seats-list">
                                    {selectedSeats.map(seat => (
                                        <div key={seat.id} className="selected-seat-item">
                                            <div>
                                                <span className="font-medium">Seat {seat.id}</span>
                                                <span className="seat-type-label capitalize">({seat.type})</span>
                                            </div>
                                            {seat.price > 0 && <span className="seat-price-upgrade">+${seat.price}</span>}
                                        </div>
                                    ))}
                                </div>
                            ) : (<p className="summary-placeholder">No seats selected</p>)}
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="summary-card glass-effect">
                            <h3 className="summary-title">Price Summary</h3>
                            <div className="price-summary-details">
                                <div className="summary-row"><span className="summary-label">Base Price ({selectedSeats.length || 1} x ${flight.price})</span><span>${flight.price * (selectedSeats.length || 1)}</span></div>
                                {selectedSeats.filter(s => s.price > 0).map(s => <div key={s.id} className="summary-row"><span className="summary-label">Seat {s.id} Upgrade</span><span>+${s.price}</span></div>)}
                                <div className="summary-total">
                                    <div className="summary-row total-row"><span className="font-semibold">Total</span><span className="total-price">${calculateTotalPrice()}</span></div>
                                </div>
                            </div>
                            <Button onClick={handleBookNow} disabled={isBooking || selectedSeats.length === 0} className="button-primary book-now-button">
                                {isBooking ? <div className="spinner-small"></div> : <><CreditCard className="icon-sm" />Book Now</>}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HotelsPage = ({ navigate }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        setIsSearching(true);
        setTimeout(() => {
            setSearchResults([
                { id: 1, name: "The Tokyo Palace", location: "Tokyo, Japan", rating: 4.9, price_per_night: 450, amenities: ["wifi", "pool", "spa"], image_url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Experience luxury in the heart of Tokyo with breathtaking city views and unparalleled service." },
                { id: 2, name: "Kyoto Serenity Inn", location: "Kyoto, Japan", rating: 4.7, price_per_night: 320, amenities: ["wifi", "spa", "restaurant"], image_url: "https://images.pexels.com/photos/2984857/pexels-photo-2984857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "A traditional Ryokan experience with modern comforts, nestled in the historic Gion district." },
                { id: 3, name: "Osaka City View Hotel", location: "Osaka, Japan", rating: 4.5, price_per_night: 210, amenities: ["wifi", "gym"], image_url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Modern, convenient, and stylish accommodation perfect for exploring the vibrant city of Osaka." }
            ]);
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="page-container page-padded">
            <div className="section-container">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="section-header">
                    <h1 className="section-title">Find Your Perfect Stay</h1>
                    <p className="section-subtitle">From luxury hotels to cozy inns, discover accommodations for every journey.</p>
                </motion.div>
                <HotelSearchForm onSearch={handleSearch} className="max-w-5xl mx-auto mb-12" />
                
                {isSearching && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-container"><div className="spinner"></div><p>Finding hotels...</p></motion.div>}

                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="results-header">
                                <h2 className="results-title">{searchResults.length} hotels found</h2>
                                <Button className="button-outline"><Filter className="icon-xs" />Filters</Button>
                            </div>
                            <div className="space-y-6">
                                {searchResults.map((hotel, index) => <HotelCard key={hotel.id} hotel={hotel} index={index} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isSearching && searchResults.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="empty-state">
                        <Building2 className="empty-state-icon" />
                        <h3 className="empty-state-title">Your journey awaits a place to stay</h3>
                        <p className="empty-state-subtitle">Use the search form to discover amazing hotels.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const BookingsPage = ({ navigate }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBookings = async () => {
            setIsLoading(true);
            const data = await Booking.list('-created_date');
            setBookings(data);
            setIsLoading(false);
        };
        loadBookings();
    }, []);
    
    const statusInfo = {
        confirmed: { class: 'status-confirmed', icon: CheckCircle },
        pending: { class: 'status-pending', icon: AlertCircle },
        cancelled: { class: 'status-cancelled', icon: XCircle }
    };
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="page-container page-padded">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="section-header">
                    <h1 className="section-title">My Bookings</h1>
                    <p className="section-subtitle">Track and manage your travel reservations</p>
                </motion.div>
                
                {isLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-container"><div className="spinner"></div><p>Loading bookings...</p></motion.div>}

                <AnimatePresence>
                    {!isLoading && bookings.length > 0 && (
                        <div className="space-y-6">
                            {bookings.map((booking, index) => {
                                const status = statusInfo[booking.status] || { class: '', icon: Clock };
                                const StatusIcon = status.icon;
                                return (
                                <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                    <Card className="glass-effect border-gray-700 hover-glow">
                                        <CardHeader>
                                            <div className="booking-card-header">
                                                <div>
                                                    <CardTitle className="capitalize">{booking.booking_type} Booking</CardTitle>
                                                    <div className="booking-date"><Calendar className="icon-xs" />Booked on {formatDate(booking.created_date)}</div>
                                                </div>
                                                <Badge className={`capitalize ${status.class}`}><StatusIcon className="icon-xs" />{booking.status}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="booking-card-grid">
                                                <div><p className="booking-label">From</p><p className="booking-value">{booking.departure_city || 'N/A'}</p></div>
                                                <div><p className="booking-label">To</p><p className="booking-value">{booking.destination}</p></div>
                                                <div><p className="booking-label">Departure</p><p className="booking-value">{formatDate(booking.departure_date)}</p></div>
                                            </div>
                                            <div className="booking-card-footer">
                                                <div>
                                                    <p className="booking-label">Total Paid</p>
                                                    <p className="booking-price">${booking.total_price?.toFixed(2) || '0.00'}</p>
                                                </div>
                                                <Button className="button-primary">Download Ticket</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
                
                {!isLoading && bookings.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="empty-state">
                        <div className="empty-state-icon-wrapper"><Plane className="empty-state-icon large" /></div>
                        <h3 className="empty-state-title">No bookings yet</h3>
                        <p className="empty-state-subtitle">Start planning your next adventure!</p>
                        <Button onClick={() => navigate("Flights")} className="button-primary">Book Your First Flight</Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};


// --- LAYOUT & APP CONTAINER --- //

const Layout = ({ children, currentPageName, navigate }) => {
    const navigationItems = [
        { title: "Home", name: "Landing", icon: Globe },
        { title: "Flights", name: "Flights", icon: Plane },
        { title: "Hotels", name: "Hotels", icon: Building2 },
        { title: "My Bookings", name: "Bookings", icon: User },
    ];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const NavLink = ({ item, isMobile }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(item.name); setMobileMenuOpen(false); }}
            className={`nav-link ${currentPageName === item.name ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
        >
            <item.icon className="nav-link-icon" />
            {item.title}
        </a>
    );

    return (
        <div className="app-container">
            <header className="app-header glass-effect">
                <div className="header-content">
                    <div className="header-left">
                        <a href="#" onClick={(e) => {e.preventDefault(); navigate('Landing');}} className="logo">
                           <Plane className="logo-icon" />
                           <span className="logo-text">TripSpark</span>
                        </a>
                        <nav className="header-nav-desktop">
                            {navigationItems.map((item) => <NavLink key={item.name} item={item} />)}
                        </nav>
                    </div>
                    <div className="header-right">
                        <div className="header-actions-desktop">
                            <Button className="button-ghost">Sign In</Button>
                            <Button className="button-primary">Sign Up</Button>
                        </div>
                        <div className="header-mobile-menu-trigger">
                             <Button onClick={() => setMobileMenuOpen(true)} className="button-ghost button-icon">
                                <Menu />
                             </Button>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mobile-menu-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="mobile-menu-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                         <div className="mobile-menu-header">
                           <span className="logo-text">Menu</span>
                           <Button onClick={() => setMobileMenuOpen(false)} className="button-ghost button-icon"><X/></Button>
                         </div>
                         <nav className="mobile-menu-nav">
                             {navigationItems.map((item) => <NavLink key={item.name} item={item} isMobile={true} />)}
                         </nav>
                         <div className="mobile-menu-footer">
                            <Button className="button-ghost button-full">Sign In</Button>
                            <Button className="button-primary button-full">Sign Up</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
            
            <main className="main-content">
                {children}
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-grid">
                        <div className="footer-col-main">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('Landing'); }} className="footer-logo-link">
                                <div className="footer-logo-icon-wrapper">
                                    <Plane className="footer-logo-icon" />
                                </div>
                                <span className="logo-text text-gradient">TripSpark</span>
                            </a>
                            <p className="footer-description">
                                Discover extraordinary destinations and create unforgettable memories with our premium travel experiences.
                            </p>
                        </div>
                        <div className="footer-col-links">
                            <h3 className="footer-links-title">Quick Links</h3>
                            <ul className="footer-links-list">
                                {navigationItems.map((item) => (
                                    <li key={item.title}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); navigate(item.name); }} className="footer-link">
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="footer-col-links">
                            <h3 className="footer-links-title">Support</h3>
                            <ul className="footer-links-list">
                                <li><a href="#" className="footer-link">Help Center</a></li>
                                <li><a href="#" className="footer-link">Contact Us</a></li>
                                <li><a href="#" className="footer-link">Terms</a></li>
                                <li><a href="#" className="footer-link">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 TripSpark. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};


export default function App() {
    const [page, setPage] = useState({ name: 'Landing', data: null });

    const navigate = (pageName, data = null) => {
        window.scrollTo(0, 0); 
        setPage({ name: pageName, data });
    };

    const pages = {
        'Landing': <LandingPage navigate={navigate} pageData={page.data} />,
        'Flights': <FlightsPage navigate={navigate} pageData={page.data} />,
        'Hotels': <HotelsPage navigate={navigate} pageData={page.data} />,
        'SeatSelection': <SeatSelectionPage navigate={navigate} pageData={page.data} />,
        'Bookings': <BookingsPage navigate={navigate} pageData={page.data} />,
    };

    const CurrentPage = pages[page.name] || <div>Page not found</div>;

    return (
        <>
            <style>
                {`
                    /* --- GLOBAL STYLES & RESETS --- */
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    :root { --toastify-color-light: #1f2937; --toastify-color-dark: #1f2937; --toastify-text-color-light: #fff; --toastify-text-color-dark: #fff;}
                    body { font-family: 'Inter', sans-serif; background-color: #0a0e1a; color: #e5e7eb; margin: 0; }
                    * { box-sizing: border-box; }
                    .glass-effect { backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); background-color: rgba(23, 29, 46, 0.75); border: 1px solid rgba(255, 255, 255, 0.125); }
                    .hover-glow:hover { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2); transition: box-shadow 0.3s ease-in-out; }
                    .text-gradient { background: linear-gradient(to right, #FBBF24, #14B8A6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                    ::-webkit-scrollbar { width: 8px; }
                    ::-webkit-scrollbar-track { background: #1e293b; }
                    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                    ::-webkit-scrollbar-thumb:hover { background: #64748b; }
                    .space-y-4 > *:not(:last-child) { margin-bottom: 1rem; }
                    .space-y-6 > *:not(:last-child) { margin-bottom: 1.5rem; }

                    /* --- ICONS --- */
                    .icon-xxs { width: 0.8rem; height: 0.8rem; margin-right: 0.25rem; }
                    .icon-xs { width: 1rem; height: 1rem; margin-right: 0.25rem; }
                    .icon-sm { width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; }
                    .icon-md { width: 1.5rem; height: 1.5rem; }
                    .star-icon { fill: #FBBF24; color: #FBBF24; }

                    /* --- BUTTONS --- */
                    .button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; transition: all 0.2s ease-in-out; border: none; cursor: pointer; padding: 0.5rem 1rem; }
                    .button:disabled { opacity: 0.5; cursor: not-allowed; }
                    .button-primary { background: linear-gradient(to right, #FBBF24, #14B8A6); color: #111827; }
                    .button-primary:hover { transform: scale(1.05); }
                    .button-outline { border: 1px solid #4b5563; color: #fff; background-color: transparent; }
                    .button-outline:hover { background-color: rgba(255,255,255,0.05); }
                    .button-ghost { background-color: transparent; color: #fff; }
                    .button-ghost:hover { background-color: rgba(255,255,255,0.1); }
                    .button-icon { width: 2.5rem; height: 2.5rem; }
                    .button-sm { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
                    .button-lg { padding: 0.75rem 3rem; font-size: 1rem; font-weight: 600; height: 3rem; }
                    .button-full { width: 100%; }

                    /* --- FORMS & INPUTS --- */
                    .input { height: 3rem; width: 100%; border-radius: 0.375rem; border: 1px solid #4b5563; background-color: rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; color: #fff; }
                    .input::placeholder { color: #9ca3af; }
                    .input:focus { outline: none; border-color: #FBBF24; }
                    .input-with-icon { position: relative; }
                    .input-with-icon .input { padding-left: 2.5rem; }
                    .input-icon { position: absolute; left: 0.75rem; bottom: 0.75rem; width: 1.25rem; height: 1.25rem; color: #9ca3af; }
                    .search-form-motion { padding: 1.5rem; border-radius: 1rem; }
                    .search-form { display: flex; flex-direction: column; gap: 1.5rem; }
                    .search-form-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
                    .hotel-search-form-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
                    .search-form-field { display: flex; flex-direction: column; }
                    .search-form-field label { font-size: 0.875rem; font-weight: 500; color: #9ca3af; margin-bottom: 0.5rem; }
                    .search-form-button-container { display: flex; justify-content: center; }
                    
                    /* --- CARDS & BADGES --- */
                    .card { border: 1px solid #374151; }
                    .card-header { padding: 1.5rem; }
                    .card-content { padding: 1.5rem; }
                    .card-title { font-size: 1.25rem; font-weight: 600; color: #fff; }
                    .badge { display: inline-flex; align-items: center; border-radius: 9999px; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; }
                    .badge-secondary { background-color: #374151; color: #d1d5db; border: 1px solid #4b5563; }
                    .status-confirmed { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
                    .status-pending { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
                    .status-cancelled { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

                    /* --- LAYOUT & CONTAINERS --- */
                    .app-container { min-height: 100vh; background-color: #0a0e1a; font-family: 'Inter', sans-serif; color: #fff; }
                    .main-content { padding-top: 5rem; }
                    .page-container { min-height: 100vh; }
                    .page-padded { padding-top: 6rem; padding-bottom: 2rem; padding-left: 1rem; padding-right: 1rem; }
                    .section-container { max-width: 1280px; margin: 0 auto; }
                    .page-section { padding: 5rem 1rem; }
                    .section-header { text-align: center; margin-bottom: 4rem; }
                    .section-title { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; }
                    .section-subtitle { font-size: 1.125rem; color: #9ca3af; max-width: 640px; margin: 0 auto; }
                    .loading-container, .empty-state { text-align: center; padding: 3rem 0; }
                    .spinner { display: inline-block; width: 3rem; height: 3rem; border-radius: 50%; border: 2px solid transparent; border-bottom-color: #FBBF24; animation: spin 1s linear infinite; margin-bottom: 1rem; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .empty-state-icon { width: 6rem; height: 6rem; color: #4b5563; margin: 0 auto 1.5rem auto; }
                    .empty-state-icon.large { width: 3rem; height: 3rem; }
                    .empty-state-icon-wrapper { width: 6rem; height: 6rem; background-color: #1f2937; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; }
                    .empty-state-title { font-size: 1.25rem; color: #d1d5db; margin-bottom: 0.5rem; }
                    .empty-state-subtitle { color: #6b7280; margin-bottom: 1.5rem; }

                    /* --- HEADER --- */
                    .app-header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
                    .header-content { display: flex; align-items: center; justify-content: space-between; height: 5rem; max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
                    .header-left { display: flex; align-items: center; gap: 2.5rem; }
                    .logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
                    .logo-icon { width: 2rem; height: 2rem; color: #FBBF24; transform: rotate(-45deg); }
                    .logo-text { font-size: 1.5rem; font-weight: 700; color: #fff; }
                    .header-nav-desktop { display: none; }
                    .nav-link { display: flex; align-items: center; padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; color: #d1d5db; text-decoration: none; transition: all 0.2s; }
                    .nav-link:hover { background-color: rgba(255,255,255,0.05); }
                    .nav-link.active { background-color: rgba(251, 191, 36, 0.1); color: #FBBF24; }
                    .nav-link-icon { width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; }
                    .header-right { display: flex; align-items: center; }
                    .header-actions-desktop { display: none; }
                    .header-mobile-menu-trigger { display: block; }
                    .mobile-menu-overlay { position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.8); }
                    .mobile-menu-panel { position: fixed; top: 0; left: 0; bottom: 0; width: 16rem; background-color: #0a0e1a; padding: 1rem; display: flex; flex-direction: column; }
                    .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                    .mobile-menu-nav { flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                    .mobile-menu-footer { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1rem; margin-top: 1rem; border-top: 1px solid #374151; }

                    /* --- FOOTER --- */
                    .app-footer { background-color: rgba(10,14,26,0.5); border-top: 1px solid #374151; margin-top: 5rem; }
                    .footer-content { max-width: 1280px; margin: 0 auto; padding: 3rem 1rem; }
                    .footer-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                    .footer-col-main { grid-column: span 1; }
                    .footer-logo-link { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; text-decoration: none; }
                    .footer-logo-icon-wrapper { width: 2.5rem; height: 2.5rem; background: linear-gradient(to right, #FBBF24, #14B8A6); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; }
                    .footer-logo-link:hover .footer-logo-icon-wrapper { transform: scale(1.1); }
                    .footer-logo-icon { width: 1.5rem; height: 1.5rem; color: #111827; }
                    .footer-description { color: #9ca3af; max-width: 448px; }
                    .footer-col-links { }
                    .footer-links-title { font-weight: 600; color: #fff; margin-bottom: 1rem; }
                    .footer-links-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
                    .footer-link { color: #9ca3af; text-decoration: none; transition: color 0.2s; }
                    .footer-link:hover { color: #FBBF24; }
                    .footer-bottom { border-top: 1px solid #374151; margin-top: 2rem; padding-top: 2rem; text-align: center; color: #9ca3af; }
                    
                    /* --- LANDING PAGE --- */
                    .hero-section { position: relative; height: 100vh; overflow: hidden; }
                    .hero-background { position: absolute; inset: 0; }
                    .hero-bg-image { width: 100%; height: 100%; object-fit: cover; }
                    .hero-bg-gradient { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.6)); }
                    .hero-content-container { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; padding: 5rem 1rem 8rem 1rem; }
                    .hero-content { max-width: 768px; margin: 0 auto; text-align: center; color: #fff; }
                    .hero-title { font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2; }
                    .hero-subtitle { font-size: 1.25rem; color: #d1d5db; max-width: 640px; margin: 0 auto 2rem auto; }
                    .hero-search-form { max-width: 768px; margin: 0 auto; }
                    .featured-destination { margin-top: 2rem; text-align: center; }
                    .featured-destination-label { color: #9ca3af; margin-bottom: 0.5rem; }
                    .featured-destination-name { font-size: 1.5rem; font-weight: 600; }
                    .featured-destination-country { color: #d1d5db; }
                    .slider-controls { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 1rem; }
                    .slider-button { width: 3rem; height: 3rem; border-radius: 9999px; color: #fff; background-color: transparent; }
                    .slider-button:hover { background-color: rgba(255,255,255,0.1); }
                    .slider-indicators { display: flex; gap: 0.5rem; }
                    .indicator { width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: rgba(255,255,255,0.3); transition: all 0.3s; cursor: pointer; border: none;}
                    .indicator.active { background-color: #FBBF24; }

                    /* --- FEATURES --- */
                    .features-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 2rem; }
                    .feature-card { border-radius: 0.75rem; padding: 2rem; text-align: center; }
                    .feature-icon-wrapper { width: 4rem; height: 4rem; background: linear-gradient(to right, #FBBF24, #14B8A6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; transition: transform 0.3s; }
                    .feature-card:hover .feature-icon-wrapper { transform: scale(1.1); }
                    .feature-icon { width: 2rem; height: 2rem; color: #111827; }
                    .feature-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
                    .feature-description { color: #9ca3af; }

                    /* --- DESTINATIONS --- */
                    .destinations-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 2rem; }
                    .destination-card-motion { position: relative; cursor: pointer; }
                    .destination-card { position: relative; overflow: hidden; border-radius: 1rem; height: 24rem; }
                    .destination-card-image-wrapper { position: absolute; inset: 0; }
                    .destination-card-image { width: 100%; height: 100%; object-fit: cover; }
                    .destination-card-image-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent); }
                    .destination-card-content-wrapper { position: absolute; inset: 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end; }
                    .destination-card-category { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; border-radius: 9999px; background-color: rgba(251, 191, 36, 0.2); color: #FBBF24; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.75rem; }
                    .destination-card-location { display: flex; align-items: center; color: #d1d5db; margin-bottom: 0.5rem; font-size: 0.875rem; }
                    .destination-card-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
                    .destination-card-description { color: #d1d5db; font-size: 0.875rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                    .destination-card-bottom-row { display: flex; align-items: center; justify-content: space-between; }
                    .destination-card-details { display: flex; align-items: center; gap: 1rem; }
                    .destination-card-rating { display: flex; align-items: center; color: #fff; }
                    .destination-card-popular-badge { position: absolute; top: 1rem; right: 1rem; background: linear-gradient(to right, #FBBF24, #14B8A6); color: #111827; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }

                    /* --- FLIGHTS PAGE --- */
                    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                    .results-title { font-size: 1.5rem; font-weight: 600; }
                    .flight-card { border-radius: 0.75rem; padding: 1.5rem; }
                    .flight-card-main { display: flex; flex-direction: column; gap: 1.5rem; }
                    .flight-card-route { display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: center; }
                    .flight-time-location { }
                    .flight-time { font-size: 1.5rem; font-weight: 700; }
                    .flight-city { color: #9ca3af; }
                    .flight-code { font-size: 0.875rem; color: #6b7280; }
                    .flight-path { text-align: center; }
                    .flight-path-line-container { display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
                    .flight-path-line { flex: 1; height: 1px; background-color: #4b5563; }
                    .flight-path-icon { margin: 0 0.75rem; width: 1.25rem; height: 1.25rem; color: #FBBF24; }
                    .flight-duration { font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.25rem; }
                    .flight-stops { font-size: 0.75rem; color: #6b7280; }
                    .flight-card-separator { display: none; }
                    .flight-card-details { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                    .flight-card-airline-info { text-align: center; }
                    .flight-airline-name { font-weight: 600; margin-bottom: 0.25rem; }
                    .flight-airline-rating { display: flex; align-items: center; justify-content: center; gap: 0.25rem; font-size: 0.875rem; color: #9ca3af; }
                    .flight-card-price-action { text-align: center; }
                    .flight-price { font-size: 1.875rem; font-weight: 700; color: #FBBF24; margin-bottom: 0.5rem; }

                    /* --- SEAT SELECTION --- */
                    .page-header-nav { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                    .back-button { color: #fff; }
                    .back-button:hover { background-color: rgba(255,255,255,0.1); }
                    .seat-selection-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                    .seat-selection-map-area { grid-column: span 1; }
                    .seat-selection-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
                    .summary-card { border-radius: 0.75rem; padding: 1.5rem; }
                    .summary-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
                    .icon-title { display: flex; align-items: center; gap: 0.5rem; }
                    .summary-row { display: flex; justify-content: space-between; align-items: center; }
                    .summary-label { color: #9ca3af; }
                    .summary-placeholder { color: #9ca3af; }
                    .selected-seats-list { display: flex; flex-direction: column; gap: 0.75rem; }
                    .selected-seat-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #374151; }
                    .seat-type-label { color: #9ca3af; font-size: 0.875rem; margin-left: 0.5rem; }
                    .seat-price-upgrade { color: #FBBF24; }
                    .price-summary-details { display: flex; flex-direction: column; gap: 0.75rem; }
                    .summary-total { border-top: 1px solid #374151; padding-top: 0.75rem; }
                    .total-row { font-size: 1.125rem; }
                    .total-price { font-size: 1.5rem; font-weight: 700; color: #FBBF24; }
                    .book-now-button { width: 100%; margin-top: 1.5rem; height: 3rem; }
                    .spinner-small { width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid transparent; border-bottom-color: #111827; animation: spin 1s linear infinite; }
                    .seat-map-container { border-radius: 0.75rem; padding: 1.5rem; }
                    .seat-map-legend { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; justify-content: center; font-size: 0.875rem; color: #d1d5db; }
                    .legend-item { display: flex; align-items: center; gap: 0.5rem; }
                    .legend-box { width: 1.25rem; height: 1.25rem; border-radius: 0.375rem; }
                    .seat-economy { background-color: #3b82f6; }
                    .seat-premium { background-color: #8b5cf6; }
                    .seat-business { background-color: #f59e0b; }
                    .seat-occupied { background-color: #4b5563; }
                    .seat-selected-legend { ring: 2px; ring-color: #FBBF24; border: 2px solid #FBBF24; }
                    .seat-map-scroll { max-height: 50vh; overflow-y: auto; padding: 0.5rem; background-color: rgba(10,14,26,0.5); border-radius: 0.5rem; }
                    .seat-class-header { text-align: center; font-weight: 600; margin-bottom: 0.75rem; }
                    .business-header { color: #f59e0b; }
                    .premium-header { color: #8b5cf6; }
                    .economy-header { color: #3b82f6; }
                    .seat-row { display: flex; align-items: center; justify-content: center; gap: 0.25rem; margin-bottom: 0.375rem; }
                    .seat-row-number { width: 1.5rem; text-align: center; color: #6b7280; font-size: 0.75rem; font-family: monospace; }
                    .seat-group { display: flex; gap: 0.25rem; }
                    .seat-aisle { width: 1rem; }
                    .seat-button { width: 1.5rem; height: 1.5rem; border-radius: 0.375rem; color: #fff; position: relative; transition: all 0.2s; border: none; }
                    .seat-button.seat-available { cursor: pointer; }
                    .seat-button.seat-available:hover { transform: scale(1.1); }
                    .seat-button.seat-selected { ring: 2px; ring-offset-2; ring-color: #FBBF24; transform: scale(1.05); }
                    .seat-button.seat-occupied { cursor: not-allowed; opacity: 0.5; background-color: #4b5563; }

                    /* --- HOTELS PAGE --- */
                    .hotel-card { border-radius: 1rem; overflow: hidden; display: flex; flex-direction: column; }
                    .hotel-card-image-wrapper { position: relative; overflow: hidden; height: 12rem; }
                    .hotel-card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
                    .hotel-card:hover .hotel-card-image { transform: scale(1.05); }
                    .hotel-card-content { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
                    .hotel-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                    .hotel-card-location { display: flex; align-items: center; font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.25rem; }
                    .hotel-card-title { font-size: 1.25rem; font-weight: 700; color: #fff; }
                    .hotel-card-rating { display: flex; align-items: center; gap: 0.25rem; background-color: rgba(31,41,55,0.5); padding: 0.25rem 0.5rem; border-radius: 9999px; }
                    .hotel-card-description { color: #9ca3af; font-size: 0.875rem; margin-bottom: 1rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                    .hotel-card-amenities { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                    .hotel-card-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 1rem; border-top: 1px solid #374151; }
                    .price-label { font-size: 0.875rem; color: #9ca3af; }
                    .price { font-size: 1.5rem; font-weight: 700; color: #FBBF24; }
                    .price-per-night { font-size: 0.875rem; font-weight: 400; color: #9ca3af; }

                    /* --- BOOKINGS PAGE --- */
                    .booking-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                    .booking-date { display: flex; align-items: center; color: #9ca3af; font-size: 0.875rem; margin-top: 0.5rem; }
                    .booking-card-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; border-top: 1px solid #374151; padding-top: 1rem; }
                    .booking-label { font-size: 0.875rem; color: #9ca3af; }
                    .booking-value { font-weight: 500; color: #fff; }
                    .booking-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #374151; }
                    .booking-price { font-size: 1.5rem; font-weight: 700; color: #FBBF24; }

                    /* --- MEDIA QUERIES --- */
                    @media (min-width: 768px) {
                        .section-title { font-size: 2.5rem; }
                        .hero-title { font-size: 3.75rem; }
                        .header-nav-desktop { display: flex; align-items: baseline; gap: 1rem; }
                        .header-mobile-menu-trigger { display: none; }
                        .header-actions-desktop { display: flex; align-items: center; gap: 0.5rem; }
                        .search-form-grid { grid-template-columns: repeat(2, 1fr); }
                        .hotel-search-form-grid { grid-template-columns: 2fr 1fr 1fr; }
                        .features-grid { grid-template-columns: repeat(3, 1fr); }
                        .destinations-grid { grid-template-columns: repeat(2, 1fr); }
                        .flight-card-main { flex-direction: row; align-items: center; }
                        .flight-card-route { grid-template-columns: 1fr auto 1fr; }
                        .flight-time-location.text-right { text-align: left; }
                        .flight-card-separator { display: block; width: 1px; height: 6rem; background-color: #374151; margin: 0 1.5rem; }
                        .flight-card-details { flex-direction: row; justify-content: space-between; width: auto; }
                        .flight-card-airline-info, .flight-card-price-action { text-align: left; }
                        .seat-selection-layout { grid-template-columns: 2fr 1fr; }
                        .hotel-card { flex-direction: row; }
                        .hotel-card-image-wrapper { height: auto; width: 33.33%; }
                        .hotel-card-content { width: 66.67%; }
                        .booking-card-grid { grid-template-columns: repeat(3, 1fr); }
                        .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
                    }
                    @media (min-width: 1024px) {
                        .destinations-grid { grid-template-columns: repeat(3, 1fr); }
                        .search-form-grid { grid-template-columns: repeat(4, 1fr); }
                    }
                `}
            </style>
            <Layout currentPageName={page.name} navigate={navigate}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {CurrentPage}
                    </motion.div>
                </AnimatePresence>
            </Layout>
        </>
    );
}

