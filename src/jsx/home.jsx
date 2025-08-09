import React, { useRef, useState } from 'react';
import all from '../images/all_colors.jpg';
import black from '../images/black.jpg';
import desert from '../images/desert.jpg';
import natural from '../images/natural.jpg';
import white from '../images/white.jpg';
import '../css/home.css';

function Home() {
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // "success" or "error"
    const [isClosing, setIsClosing] = useState(false);
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [locationType, setLocationType] = useState(""); // home or office
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [selectedColor, setSelectedColor] = useState("all");

    // State to control the image animation
    const [isImageFading, setIsImageFading] = useState(false);

    const basePrice = 189000; // base product price

    // Delivery prices for all 58 wilayas (example values)
    const deliveryFeesHome = {
        "1": 3000, "2": 2000, "3": 2500, "4": 2000, "5": 1800, "6": 2200, "7": 2100, "8": 2300, "9": 2400, "10": 2000,
        "11": 2500, "12": 2000, "13": 2300, "14": 2400, "15": 2500, "16": 1000, "17": 1900, "18": 2200, "19": 2100, "20": 2000,
        "21": 2500, "22": 2300, "23": 2200, "24": 2400, "25": 2500, "26": 2100, "27": 2000, "28": 2500, "29": 2300, "30": 1200,
        "31": 2500, "32": 2400, "33": 2500, "34": 2000, "35": 2100, "36": 2300, "37": 2500, "38": 2200, "39": 2100, "40": 2500,
        "41": 2400, "42": 2300, "43": 2500, "44": 2000, "45": 2500, "46": 2400, "47": 2500, "48": 2000, "49": 2500, "50": 2300,
        "51": 2500, "52": 2400, "53": 2500, "54": 2000, "55": 2500, "56": 2400, "57": 2500, "58": 2000
    };

    const deliveryFeesOffice = {
        "1": 1200, "2": 1700, "3": 2200, "4": 1700, "5": 1500, "6": 1900, "7": 1800, "8": 2000, "9": 2100, "10": 1700,
        "11": 2200, "12": 1700, "13": 2000, "14": 2100, "15": 2200, "16": 800, "17": 1600, "18": 1900, "19": 1800, "20": 1700,
        "21": 2200, "22": 2000, "23": 1900, "24": 2100, "25": 2200, "26": 1800, "27": 1700, "28": 2200, "29": 2000, "30": 1000,
        "31": 2200, "32": 2100, "33": 2200, "34": 1700, "35": 1800, "36": 2000, "37": 2200, "38": 1900, "39": 1800, "40": 2200,
        "41": 2100, "42": 2000, "43": 2200, "44": 1700, "45": 2200, "46": 2100, "47": 2200, "48": 1700, "49": 2200, "50": 2000,
        "51": 2200, "52": 2100, "53": 2200, "54": 1700, "55": 2200, "56": 2100, "57": 2200, "58": 1700
    };

    // Update delivery & total prices
    const updatePrices = (wilaya, location) => {
        if (!wilaya || !location) return;
        const fee = location === "home" ? deliveryFeesHome[wilaya] : deliveryFeesOffice[wilaya];
        setDeliveryPrice(fee || 0);
        document.getElementById('price-delivery').value = (fee || 0).toLocaleString() + " DA";
        document.getElementById('total-price').value = (basePrice + (fee || 0)).toLocaleString() + " DA";
    };

    const handleWilayaChange = (e) => {
        const selected = e.target.value;
        setSelectedWilaya(selected);
        updatePrices(selected, locationType);
    };

    const handleLocationChange = (e) => {
        const selected = e.target.value;
        setLocationType(selected);
        updatePrices(selectedWilaya, selected);
    };

    const handleColorChange = (color) => {
        // Don't re-animate if the same color is selected
        if (color === selectedColor) return;

        // 1. Start the fade-out animation
        setIsImageFading(true);

        // 2. Wait for the animation to complete (should match CSS transition duration)
        setTimeout(() => {
            // 3. Change the image source
            setSelectedColor(color);
            // 4. Start the fade-in animation
            setIsImageFading(false);
        }, 400); 
    };

    const imagesRef = useRef(null);
    const buyRef = useRef(null);

    const scrollToSection = (elementRef) => {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const offsetTop = elementRef.current.offsetTop;
        window.scrollTo({
            top: offsetTop - navHeight - 10,
            behavior: 'smooth'
        });
    };

    // Validate required fields and highlight errors
    const validateForm = () => {
        const errors = {};
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const ram = document.querySelector('input[name="ram"]:checked')?.value || '';
        const storage = document.querySelector('input[name="storage"]:checked')?.value || '';
        const sim = document.querySelector('input[name="sim"]:checked')?.value || '';
        const color = document.querySelector('input[name="color"]:checked')?.value || '';
        const wilaya = selectedWilaya;
        const location = locationType;

        if (!name) errors.name = true;
        if (!phone) errors.phone = true;
        if (!ram) errors.ram = true;
        if (!storage) errors.storage = true;
        if (!sim) errors.sim = true;
        if (!color) errors.color = true;
        if (!wilaya) errors.wilaya = true;
        if (!location) errors.location = true;

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const collectFormData = () => {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const ram = document.querySelector('input[name="ram"]:checked')?.value || '';
        const storage = document.querySelector('input[name="storage"]:checked')?.value || '';
        const sim = document.querySelector('input[name="sim"]:checked')?.value || '';
        const color = document.querySelector('input[name="color"]:checked')?.value || '';
        const wilaya = selectedWilaya;
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email').value.trim();
        const location = locationType;

        return {
            name,
            email,
            phone,
            ram,
            storage,
            sim,
            color,
            wilaya,
            address,
            location,
            priceDelivery: deliveryPrice,
            totalPrice: basePrice + deliveryPrice
        };
    };

    const handleBuyNow = () => {
        if (!validateForm()) {
            setAlertMessage("⚠ Please fill in all required fields.");
            setAlertType("error");
            setIsClosing(false); // Ensure not closing when showing new alert
            return;
        }

        const data = collectFormData();
        setFormData(data);
        setShowConfirmation(true);
    };

    const handleConfirmOrder = async () => {
        setIsLoading(true);
        setAlertMessage("");
        setAlertType("");
        setIsClosing(false);

        try {
            await fetch(
                'https://script.google.com/macros/s/AKfycbz_lJApaLCEtMLqvI0IhOa70C_efhx97RYxfK5ZKnA6CW2Q6Cd5iRQcj5kSCh5KXIZO/exec',
                {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );
            setShowConfirmation(false);
            setShowSuccessPopup(true);
        } catch {
            setAlertMessage("❌ Error sending order. Please try again.");
            setAlertType("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to style inputs with error border
    const errorStyle = { border: "2px solid red" };

    const colorImages = {
        all: { src: all, alt: "all colors" },
        black: { src: black, alt: "black color" },
        desert: { src: desert, alt: "desert color" },
        natural: { src: natural, alt: "natural color" },
        white: { src: white, alt: "white color" }
    };
    

    return (
        <div className='container-home'>
            {alertMessage && !showSuccessPopup && (
                <div 
                    className={`custom-alert ${alertType}`}
                    style={{ 
                        opacity: isClosing ? 0 : 1, 
                        transition: 'opacity 0.3s ease' 
                    }}
                    onTransitionEnd={() => {
                        if (isClosing) {
                            setAlertMessage("");
                            setIsClosing(false);
                        }
                    }}
                >
                    {alertMessage}
                    <span
                        className="close-alert"
                        onClick={() => setIsClosing(true)}
                        style={{ cursor: 'pointer', float: 'right', marginLeft: '10px', fontSize: '1.2em' }}
                    >
                        ×
                    </span>
                </div>
            )}

            <nav className='nav'>
                <button onClick={() => scrollToSection(imagesRef)} className='up-to-img'>Images</button>
                <h3 className='name-store'>Store Name</h3>
                <button onClick={() => scrollToSection(buyRef)} className='btn-buy-up'>Buy Now</button>
            </nav>

            <h2 className='title'>iPhone 16 Pro Max</h2>
            <div ref={imagesRef} className='img-btn'>
                <div className='container-images'>
                    <img 
                        className={`img-color ${isImageFading ? 'fading' : ''}`} 
                        src={colorImages[selectedColor].src} 
                        alt={colorImages[selectedColor].alt} 
                    />
                </div>
                <div className='change-colors'>
                    <button onClick={() => handleColorChange('all')}>All</button>
                    <button onClick={() => handleColorChange('black')}>Black</button>
                    <button onClick={() => handleColorChange('desert')}>Desert</button>
                    <button onClick={() => handleColorChange('natural')}>Natural</button>
                    <button onClick={() => handleColorChange('white')}>White</button>
                </div>
            </div>

            <h3 className='price'>{basePrice.toLocaleString()} DA</h3>
            <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

            <div ref={buyRef} className='container-form'>
                <h2>Order Form</h2>
                <form className='form' onSubmit={(e) => e.preventDefault()}>
                    <label>
                        Name *
                        <input
                            type="text"
                            className='input'
                            id='name'
                            style={fieldErrors.name ? errorStyle : {}}
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            className='input'
                            id='email'
                        />
                    </label>

                    <label>
                        Phone number *
                        <input
                            type="number"
                            className='input'
                            id='phone'
                            style={fieldErrors.phone ? errorStyle : {}}
                        />
                    </label>

                    <label>RAM *</label>
                    <div className="radio-group" style={fieldErrors.ram ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="ram4" name="ram" value="4GB" />
                        <label htmlFor="ram4">4GB</label>

                        <input type="radio" id="ram6" name="ram" value="6GB" />
                        <label htmlFor="ram6">6GB</label>

                        <input type="radio" id="ram8" name="ram" value="8GB" />
                        <label htmlFor="ram8">8GB</label>
                    </div>

                    <label>Storage *</label>
                    <div className="radio-group" style={fieldErrors.storage ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="st32" name="storage" value="32GB" />
                        <label htmlFor="st32">32GB</label>

                        <input type="radio" id="st64" name="storage" value="64GB" />
                        <label htmlFor="st64">64GB</label>

                        <input type="radio" id="st128" name="storage" value="128GB" />
                        <label htmlFor="st128">128GB</label>

                        <input type="radio" id="st256" name="storage" value="256GB" />
                        <label htmlFor="st256">256GB</label>
                    </div>

                    <label>Number of SIM cards *</label>
                    <div className="radio-group" style={fieldErrors.sim ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="sim1" name="sim" value="1" />
                        <label htmlFor="sim1">1</label>

                        <input type="radio" id="sim2" name="sim" value="2" />
                        <label htmlFor="sim2">2</label>
                    </div>

                    <label>Color *</label>
                    <div className="radio-group" style={fieldErrors.color ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="color-black" name="color" value="black" />
                        <label htmlFor="color-black">Black</label>
                        <input type="radio" id="color-desert" name="color" value="desert" />
                        <label htmlFor="color-desert">Desert</label>
                        <input type="radio" id="color-natural" name="color" value="natural" />
                        <label htmlFor="color-natural">Natural</label>
                        <input type="radio" id="color-white" name="color" value="white" />
                        <label htmlFor="color-white">White</label>
                    </div>

                    <label>
                        City (Wilaya) *
                        <select
                            name="wilaya"
                            className='input'
                            id="wilaya"
                            defaultValue=""
                            onChange={handleWilayaChange}
                            style={fieldErrors.wilaya ? errorStyle : {}}
                        >
                            <option value="" disabled>-- Select your wilaya --</option>
                            <option value="1">01 - Adrar</option>
                            <option value="2">02 - Chlef</option>
                            <option value="3">03 - Laghouat</option>
                            <option value="4">04 - Oum El Bouaghi</option>
                            <option value="5">05 - Batna</option>
                            <option value="6">06 - Béjaïa</option>
                            <option value="7">07 - Biskra</option>
                            <option value="8">08 - Béchar</option>
                            <option value="9">09 - Blida</option>
                            <option value="10">10 - Bouira</option>
                            <option value="11">11 - Tamanrasset</option>
                            <option value="12">12 - Tébessa</option>
                            <option value="13">13 - Tlemcen</option>
                            <option value="14">14 - Tiaret</option>
                            <option value="15">15 - Tizi Ouzou</option>
                            <option value="16">16 - Alger</option>
                            <option value="17">17 - Djelfa</option>
                            <option value="18">18 - Jijel</option>
                            <option value="19">19 - Sétif</option>
                            <option value="20">20 - Saïda</option>
                            <option value="21">21 - Skikda</option>
                            <option value="22">22 - Sidi Bel Abbès</option>
                            <option value="23">23 - Annaba</option>
                            <option value="24">24 - Guelma</option>
                            <option value="25">25 - Constantine</option>
                            <option value="26">26 - Médéa</option>
                            <option value="27">27 - Mostaganem</option>
                            <option value="28">28 - M'Sila</option>
                            <option value="29">29 - Mascara</option>
                            <option value="30">30 - Ouargla</option>
                            <option value="31">31 - Oran</option>
                            <option value="32">32 - El Bayadh</option>
                            <option value="33">33 - Illizi</option>
                            <option value="34">34 - Bordj Bou Arréridj</option>
                            <option value="35">35 - Boumerdès</option>
                            <option value="36">36 - El Tarf</option>
                            <option value="37">37 - Tindouf</option>
                            <option value="38">38 - Tissemsilt</option>
                            <option value="39">39 - El Oued</option>
                            <option value="40">40 - Khenchela</option>
                            <option value="41">41 - Souk Ahras</option>
                            <option value="42">42 - Tipaza</option>
                            <option value="43">43 - Mila</option>
                            <option value="44">44 - Aïn Defla</option>
                            <option value="45">45 - Naâma</option>
                            <option value="46">46 - Aïn Témouchent</option>
                            <option value="47">47 - Ghardaïa</option>
                            <option value="48">48 - Relizane</option>
                            <option value="49">49 - El M'ghair</option>
                            <option value="50">50 - El Meniaa</option>
                            <option value="51">51 - Ouled Djellal</option>
                            <option value="52">52 - Bordj Badji Mokhtar</option>
                            <option value="53">53 - Béni Abbès</option>
                            <option value="54">54 - Timimoun</option>
                            <option value="55">55 - Touggourt</option>
                            <option value="56">56 - Djanet</option>
                            <option value="57">57 - In Salah</option>
                            <option value="58">58 - In Guezzam</option>
                        </select>
                    </label>

                    <label>Delivery Location *</label>
                    <div className="radio-group" style={fieldErrors.location ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="loc-home" name="location" value="home" onChange={handleLocationChange} />
                        <label htmlFor="loc-home">Home</label>
                        <input type="radio" id="loc-office" name="location" value="office" onChange={handleLocationChange} />
                        <label htmlFor="loc-office">Office</label>
                    </div>

                    <label>
                        Address
                        <input
                            type="text"
                            className='input'
                            id='address'
                            style={fieldErrors.address ? errorStyle : {}}
                        />
                    </label>

                    <label>
                        Delivery Price
                        <input type="text" className='input' id='price-delivery' readOnly defaultValue={"0 DA"}/>
                    </label>

                    <label>
                        Total Price
                        <input type="text" className='input' id='total-price' readOnly defaultValue={basePrice.toLocaleString() + " DA"}/>
                    </label>
                </form>
            </div>

            <button className='btn-buy' onClick={handleBuyNow}>Buy Now</button>

            <div className='container-footer'>
                <p className='footer-text'>© 2025 Store Name. All rights reserved.</p>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupBox}>
                        <h2>Confirm Order</h2>
                        <p>Please review your order details:</p>
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {formData.phone}</p>
                            <p><strong>RAM:</strong> {formData.ram}</p>
                            <p><strong>Storage:</strong> {formData.storage}</p>
                            <p><strong>SIM Cards:</strong> {formData.sim}</p>
                            <p><strong>Color:</strong> {formData.color}</p>
                            <p><strong>Wilaya:</strong> {formData.wilaya}</p>
                            <p><strong>Delivery Location:</strong> {formData.location}</p>
                            <p><strong>Address:</strong> {formData.address}</p>
                            <p><strong>Delivery Price:</strong> {formData.priceDelivery.toLocaleString()} DA</p>
                            <p><strong>Total Price:</strong> {formData.totalPrice.toLocaleString()} DA</p>
                        </div>
                        {isLoading ? (
                            <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Sending order...</p>
                        ) : (
                            <div>
                                <button
                                    onClick={handleConfirmOrder}
                                    style={styles.confirmButton}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success Popup Overlay */}
            {showSuccessPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupBox}>
                        <div style={styles.checkmark}>&#10004;</div>
                        <h2>Order Successful!</h2>
                        <p>Thank you for your purchase.</p>
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            style={styles.closeButton}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    popupOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease'
    },
    popupBox: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        animation: 'scaleIn 0.3s ease',
        maxWidth: '400px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    checkmark: {
        fontSize: '4rem',
        color: '#4caf50',
        marginBottom: '15px',
        animation: 'bounceIn 0.5s ease'
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 25px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    confirmButton: {
        marginTop: '20px',
        padding: '10px 25px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
    },
    cancelButton: {
        marginTop: '20px',
        padding: '10px 25px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default Home;