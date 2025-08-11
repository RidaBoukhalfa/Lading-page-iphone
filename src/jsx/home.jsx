import React, { useRef, useState, useEffect } from 'react';
import all from '../images/all_colors.jpg';
import black from '../images/black.jpg';
import desert from '../images/desert.jpg';
import natural from '../images/natural.jpg';
import white from '../images/white.jpg';
import camera from '../images/camera.png';
import battery from '../images/battery.png';
import phone from '../images/phone.png';
import processor from '../images/processor_.png';
import '../css/home.css';

function Home() {
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isClosing, setIsClosing] = useState(false);
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [locationType, setLocationType] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [selectedColor, setSelectedColor] = useState("all");
    const [quantity, setQuantity] = useState(1);
    const [isImageFading, setIsImageFading] = useState(false);
    const [isBottomButtonVisible, setIsBottomButtonVisible] = useState(true); // State for bottom button visibility

    const formattedPrice = 295000.00;


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

    const updatePrices = (wilaya, location, qty = quantity) => {
        if (!wilaya || !location) return;
        const fee = location === "home" ? deliveryFeesHome[wilaya] : deliveryFeesOffice[wilaya];
        setDeliveryPrice(fee || 0);
        document.getElementById('price-delivery').value = (fee || 0).toLocaleString('ar-DZ') + " دج";
        document.getElementById('total-price').value = ((formattedPrice * qty) + (fee || 0)).toLocaleString('ar-DZ') + " دج";
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

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value < 1) return;
        setQuantity(value);
        updatePrices(selectedWilaya, locationType, value);
    };

    const handleColorChange = (color) => {
        if (color === selectedColor) return;
        setIsImageFading(true);
        setTimeout(() => {
            setSelectedColor(color);
            setIsImageFading(false);
        }, 400);
    };

    const imagesRef = useRef(null);
    const buyRef = useRef(null);

    const scrollToSection = (elementRef) => {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const offsetTop = elementRef.current.offsetTop;
        window.scrollTo({
            top: offsetTop - navHeight - 20,
            behavior: 'smooth'
        });
    };

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
        const qty = quantity;

        if (!name) errors.name = true;
        if (!phone) errors.phone = true;
        if (!ram) errors.ram = true;
        if (!storage) errors.storage = true;
        if (!sim) errors.sim = true;
        if (!color) errors.color = true;
        if (!wilaya) errors.wilaya = true;
        if (!location) errors.location = true;
        if (!qty || qty < 1) errors.quantity = true;

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
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
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
            quantity,
            priceDelivery: deliveryPrice,
            totalPrice: (formattedPrice * quantity) + deliveryPrice
        };
    };

    const handleBuyNow = () => {
        if (!validateForm()) {
            setAlertMessage("⚠ الرجاء ملء جميع الحقول المطلوبة.");
            setAlertType("error");
            setIsClosing(false);
            scrollToSection(buyRef); // Scroll to form if validation fails
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
                'https://script.google.com/macros/s/AKfycbxJmlfCiWxx_6CIch6aC8DZ9qDF4PnKMvibZ8u66GB-e-7_P5D413nh8AzBgvKHlTJi/exec',
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
            setAlertMessage("❌ خطأ في إرسال الطلب. الرجاء المحاولة مرة أخرى.");
            setAlertType("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Intersection Observer to hide/show bottom button when form is in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsBottomButtonVisible(!entry.isIntersecting); // Hide button when form is in view
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the form is visible
            }
        );

        if (buyRef.current) {
            observer.observe(buyRef.current);
        }

        return () => {
            if (buyRef.current) {
                observer.unobserve(buyRef.current);
            }
        };
    }, []);

    const errorStyle = { border: "2px solid red" };

    const colorImages = {
        all: { src: all, alt: "جميع الألوان" },
        black: { src: black, alt: "اللون الأسود" },
        desert: { src: desert, alt: "لون الصحراء" },
        natural: { src: natural, alt: "اللون الطبيعي" },
        white: { src: white, alt: "اللون الأبيض" }
    };



    const [showSpecs, setShowSpecs] = useState(false);


    return (
        <div className='container-home' dir="rtl">
            {alertMessage && !showSuccessPopup && (
                <div 
                    className={`custom-alert ${alertType}`}
                    style={{ 
                        opacity: isClosing ? 0 : 1, 
                        transition: 'opacity 0.3s ease',
                        textAlign: 'right'
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
                        style={{ cursor: 'pointer', float: 'left', marginRight: '10px', fontSize: '1.2em' }}
                    >
                        ×
                    </span>
                </div>
            )}

            <nav className='nav'>
                <button onClick={() => scrollToSection(imagesRef)} className='up-to-img'>الصور</button>
                <h3 className='name-store'>اسم المتجر</h3>
                <button onClick={() => scrollToSection(buyRef)} className='btn-buy-up'>اشتر الآن</button>
            </nav>

            <h2 className='title'>IPHONE 16 PRO MAX</h2>
            <div ref={imagesRef} className='img-btn'>
                <div className='container-images'>
                    <img 
                        className={`img-color ${isImageFading ? 'fading' : ''}`} 
                        src={colorImages[selectedColor].src} 
                        alt={colorImages[selectedColor].alt} 
                    />
                </div>
                <div className='change-colors'>
                    <button onClick={() => handleColorChange('all')}>الكل</button>
                    <button onClick={() => handleColorChange('black')}>أسود</button>
                    <button onClick={() => handleColorChange('desert')}>صحراوي</button>
                    <button onClick={() => handleColorChange('natural')}>طبيعي</button>
                    <button onClick={() => handleColorChange('white')}>أبيض</button>
                </div>
            </div>

            <h3 className='price'>{formattedPrice.toLocaleString('ar-DZ')} دج</h3>

            <div ref={buyRef} className='container-form'>
                <h2>نموذج الطلب</h2>
                <form className='form' onSubmit={(e) => e.preventDefault()}>
                    <label>
                        الاسم *
                        <input
                            type="text"
                            className='input'
                            id='name'
                            style={fieldErrors.name ? errorStyle : {}}
                            placeholder="أدخل اسمك"
                        />
                    </label>

                    <label>
                        البريد الإلكتروني
                        <input
                            type="email"
                            className='input'
                            id='email'
                            placeholder="أدخل بريدك الإلكتروني"
                        />
                    </label>

                    <label>
                        رقم الهاتف *
                        <input
                            type="number"
                            className='input'
                            id='phone'
                            style={fieldErrors.phone ? errorStyle : {}}
                            placeholder="أدخل رقم هاتفك"
                        />
                    </label>

                    <label>الذاكرة العشوائية (RAM) *</label>
                    <div className="radio-group" style={fieldErrors.ram ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="ram8" name="ram" value="8GB" />
                        <label htmlFor="ram8">8GB</label>
                    </div>

                    <label>التخزين *</label>
                    <div className="radio-group" style={fieldErrors.storage ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="st256" name="storage" value="256GB" />
                        <label htmlFor="st256">256GB</label>
                        <input type="radio" id="st512" name="storage" value="512GB" />
                        <label htmlFor="st512">512GB</label>
                        <input type="radio" id="st1" name="storage" value="1TB" />
                        <label htmlFor="st1">1TB</label>
                    </div>

                    <label>عدد بطاقات SIM *</label>
                    <div className="radio-group" style={fieldErrors.sim ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="sim1" name="sim" value="1" />
                        <label htmlFor="sim1">1</label>
                        <input type="radio" id="sim2" name="sim" value="2" />
                        <label htmlFor="sim2">2</label>
                    </div>

                    <label>اللون *</label>
                    <div className="radio-group" style={fieldErrors.color ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="color-black" name="color" value="black" />
                        <label htmlFor="color-black">أسود</label>
                        <input type="radio" id="color-desert" name="color" value="desert" />
                        <label htmlFor="color-desert">صحراوي</label>
                        <input type="radio" id="color-natural" name="color" value="natural" />
                        <label htmlFor="color-natural">طبيعي</label>
                        <input type="radio" id="color-white" name="color" value="white" />
                        <label htmlFor="color-white">أبيض</label>
                    </div>

                    <label>
                        الولاية *
                        <select
                            name="wilaya"
                            className='input'
                            id="wilaya"
                            defaultValue=""
                            onChange={handleWilayaChange}
                            style={fieldErrors.wilaya ? errorStyle : {}}
                            dir='ltr'
                        >
                            <option value="" disabled>-- اختر ولايتك --</option>
                            <option value="1">01 - أدرار</option>
                            <option value="2">02 - الشلف</option>
                            <option value="3">03 - الأغواط</option>
                            <option value="4">04 - أم البواقي</option>
                            <option value="5">05 - باتنة</option>
                            <option value="6">06 - بجاية</option>
                            <option value="7">07 - بسكرة</option>
                            <option value="8">08 - بشار</option>
                            <option value="9">09 - البليدة</option>
                            <option value="10">10 - البويرة</option>
                            <option value="11">11 - تمنراست</option>
                            <option value="12">12 - تبسة</option>
                            <option value="13">13 - تلمسان</option>
                            <option value="14">14 - تيارت</option>
                            <option value="15">15 - تيزي وزو</option>
                            <ArabicWilayas />
                        </select>
                    </label>

                    <label>موقع التوصيل *</label>
                    <div className="radio-group" style={fieldErrors.location ? { border: "1.5px solid red", padding: "5px", borderRadius: "8px" } : {}}>
                        <input type="radio" id="loc-home" name="location" value="home" onChange={handleLocationChange} />
                        <label htmlFor="loc-home">المنزل</label>
                        <input type="radio" id="loc-office" name="location" value="office" onChange={handleLocationChange} />
                        <label htmlFor="loc-office">المكتب</label>
                    </div>

                    <label>
                        العنوان
                        <input
                            type="text"
                            className='input'
                            id='address'
                            placeholder="أدخل عنوانك"
                            style={fieldErrors.address ? errorStyle : {}}
                        />
                    </label>

                    <label>
                        الكمية *
                        <input
                            type="number"
                            className='input'
                            id='quantity'
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            style={fieldErrors.quantity ? errorStyle : {}}
                            placeholder="أدخل الكمية"
                        />
                    </label>

                    <label>
                        سعر التوصيل
                        <input type="text" className='input' id='price-delivery' readOnly defaultValue={"0 دج"} />
                    </label>

                    <label>
                        السعر الإجمالي
                        <input type="text" className='input' id='total-price' readOnly defaultValue={(formattedPrice * quantity).toLocaleString('ar-DZ') + " دج"} />
                    </label>
                </form>
            </div>

            <button className='btn-buy' onClick={handleBuyNow}>اشتر الآن</button>

            {/* <div className='performance-specs'>
                <h2 className='title'>مواصفات IPHONE 16 PRO MAX</h2>
                <div className='specs-container'>
                    <div className='spec-item'>
                        <h3 className='spec-title'>المعالج</h3>
                        <p>شريحة A18 Pro مع معالج سداسي النواة (2 نواة أداء، 4 نوى كفاءة)، وحدة معالجة رسوميات سداسية النواة، ومحرك عصبي 16 نواة، يوفر أداءً أسرع بنسبة 20% ورسوميات محسنة بنسبة 30% مقارنة بالجيل السابق.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>الذاكرة</h3>
                        <p>8GB LPDDR5 RAM لتعدد المهام بسلاسة ودعم التطبيقات المتطلبة مثل الألعاب وتحرير الفيديو.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>التخزين</h3>
                        <p>خيارات تخزين داخلية 256 جيجابايت، 512 جيجابايت، أو 1 تيرابايت، توفر مساحة وفيرة للتطبيقات، الصور، الفيديوهات، والملفات.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>الشاشة</h3>
                        <p>شاشة سوبر ريتينا XDR مقاس 6.9 بوصة مع تقنية ProMotion، معدل تحديث 120Hz، تقنية العرض الدائم، سطوع يصل إلى 2000 شمعة، وحماية Ceramic Shield لألوان زاهية ومتانة عالية.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>نظام الكاميرا</h3>
                        <p>كاميرا رئيسية Fusion بدقة 48 ميجابكسل مع تصوير حوسبي متقدم، كاميرا فائقة الاتساع 12 ميجابكسل، كاميرا تيليفوتو 12 ميجابكسل بتقريب 5x، ودعم تسجيل فيديو Dolby Vision بدقة 4K بمعدل 120 إطارًا في الثانية.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>البطارية</h3>
                        <p>ما يصل إلى 29 ساعة من تشغيل الفيديو، مع شحن سريع (50% في 30 دقيقة) وشحن لاسلكي MagSafe حتى 25 واط.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>الاتصال</h3>
                        <p>5G (sub-6 GHz و mmWave)، Wi-Fi 7 لتحميل فائق السرعة، USB-C 3.2 Gen 2 لنقل البيانات بسرعة عالية، ودعم بطاقتي eSIM.</p>
                    </div>
                    <div className='spec-item'>
                        <h3 className='spec-title'>نظام التشغيل</h3>
                        <p>iOS 18 مع ميزات ذكاء اصطناعي متقدمة، تحكم محسن بالخصوصية، وتكامل سلس مع خدمات نظام Apple البيئي.</p>
                    </div>
                </div>
            </div> */}




                <div className="performance-specs">
                    {/* Title row */}
                    <div className="specs-header">
                        <h2 className="title-performance">مواصفات IPHONE 16 PRO MAX</h2>

                        <div className='desc'>
                            <div className='icon-container'>
                                <div className='icon-item'>
                                    <img src={camera} alt="كاميرا" />
                                    <h6>كاميرا ثلاثية العدسات و تصوير ليلي مذهل وفيديو بدقة 8K.</h6>
                                </div>
                                <div className='icon-item'>
                                    <img src={battery} alt="بطارية" />
                                    <h6>بطارية + MagSafe: عمر أطول وشحن أسرع.</h6>
                                </div>
                                <div className='icon-item'>
                                    <img src={phone} alt="هاتف" />
                                    <h6>شاشة سوبر ريتينا XDR 120Hz: ألوان زاهية وحركة سلسة.</h6>
                                </div>
                                <div className='icon-item'>
                                    <img src={processor} alt="معالج" />
                                    <h6>A18 Pro: سرعة استثنائية وكفاءة طاقة عالية.</h6>
                                </div>
                            </div>
                        </div>


                        <button
                        className="toggle-btn"
                        onClick={() => setShowSpecs(!showSpecs)}
                        >
                        {showSpecs ? 'إخفاء' : 'عرض المزيد'}
                        </button>
                    </div>

                    {/* Collapsible content */}
                    <div className={`specs-container-wrapper ${showSpecs ? 'open' : ''}`}>
                        <div className="specs-container">
                            <div className='spec-item'>
                                <h3 className='spec-title'>المعالج</h3>
                                <p>شريحة A18 Pro مع معالج سداسي النواة (2 نواة أداء، 4 نوى كفاءة)، وحدة معالجة رسوميات سداسية النواة، ومحرك عصبي 16 نواة، يوفر أداءً أسرع بنسبة 20% ورسوميات محسنة بنسبة 30% مقارنة بالجيل السابق.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>الذاكرة</h3>
                                <p>8GB LPDDR5 RAM لتعدد المهام بسلاسة ودعم التطبيقات المتطلبة مثل الألعاب وتحرير الفيديو.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>التخزين</h3>
                                <p>خيارات تخزين داخلية 256 جيجابايت، 512 جيجابايت، أو 1 تيرابايت، توفر مساحة وفيرة للتطبيقات، الصور، الفيديوهات، والملفات.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>الشاشة</h3>
                                <p>شاشة سوبر ريتينا XDR مقاس 6.9 بوصة مع تقنية ProMotion، معدل تحديث 120Hz، تقنية العرض الدائم، سطوع يصل إلى 2000 شمعة، وحماية Ceramic Shield لألوان زاهية ومتانة عالية.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>نظام الكاميرا</h3>
                                <p>كاميرا رئيسية Fusion بدقة 48 ميجابكسل مع تصوير حوسبي متقدم، كاميرا فائقة الاتساع 12 ميجابكسل، كاميرا تيليفوتو 12 ميجابكسل بتقريب 5x، ودعم تسجيل فيديو Dolby Vision بدقة 4K بمعدل 120 إطارًا في الثانية.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>البطارية</h3>
                                <p>ما يصل إلى 29 ساعة من تشغيل الفيديو، مع شحن سريع (50% في 30 دقيقة) وشحن لاسلكي MagSafe حتى 25 واط.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>الاتصال</h3>
                                <p>5G (sub-6 GHz و mmWave)، Wi-Fi 7 لتحميل فائق السرعة، USB-C 3.2 Gen 2 لنقل البيانات بسرعة عالية، ودعم بطاقتي eSIM.</p>
                            </div>
                            <div className='spec-item'>
                                <h3 className='spec-title'>نظام التشغيل</h3>
                                <p>iOS 18 مع ميزات ذكاء اصطناعي متقدمة، تحكم محسن بالخصوصية، وتكامل سلس مع خدمات نظام Apple البيئي.</p>
                            </div>
                        </div>
                    </div>
                </div>
            <h2>الأسئلة الشائعة</h2>
            <div className="chat-card">
                <div className="chat-header">
                    <div className="h2">اسم المتجر</div>
                </div>
                <div className="chat-body">
                    <div className="message incoming">
                        <p>مرحبًا، كيف يمكنني مساعدتك اليوم؟</p>
                    </div>
                    <div className="message outgoing">
                        <p>كم يستغرق توصيل الطلب؟</p>
                    </div>
                    <div className="message incoming">
                        <p>عادةً يتم التوصيل خلال 1-3 أيام عمل، ويعتمد على موقعك الجغرافي.</p>
                    </div>
                    <div className="message outgoing">
                        <p>هل يمكنني إرجاع أو استبدال المنتج؟</p>
                    </div>
                    <div className="message incoming">
                        <p>نعم، يمكنك طلب الإرجاع أو الاستبدال خلال 3 أيام من استلام الطلب بشرط أن يكون المنتج بحالته الأصلية.</p>
                    </div>
                </div>
                <div className="chat-footer">
                    <input type="text" placeholder='اكتب رسالتك هنا...' readOnly />
                    <button>Send</button>
                </div>
            </div>

            <div className='contact-us'>
                <h2 className='title-socail-media'>تواصل معنا</h2>
                <ul className="socail-media">
                    <li>
                        <a href="#">
                            <svg viewBox="0 0 10.712 20" height="20" width="10.712" xmlns="http://www.w3.org/2000/svg">
                                <path transform="translate(-22.89)" d="M32.9,11.25l.555-3.62H29.982V5.282a1.81,1.81,0,0,1,2.041-1.955H33.6V.245A19.255,19.255,0,0,0,30.8,0c-2.86,0-4.73,1.734-4.73,4.872V7.63H22.89v3.62h3.179V20h3.913V11.25Z" id="facebook"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg viewBox="0 0 20 20" height="20" width="20" xmlns="http://www.w3.org/2000/svg" id="instagram">
                                <g transform="translate(15.354 3.707)" data-name="Group 64" id="Group_64">
                                    <g data-name="Group 63" id="Group_63">
                                        <path fill="#000" transform="translate(-392.401 -94.739)" d="M392.871,94.739a.47.47,0,1,0,.47.47A.47.47,0,0,0,392.871,94.739Z" data-name="Path 5" id="Path_5"></path>
                                    </g>
                                </g>
                                <g transform="translate(5.837 5.837)" data-name="Group 66" id="Group_66">
                                    <g data-name="Group 65" id="Group_65">
                                        <path fill="#000" transform="translate(-145.804 -145.804)" d="M149.967,145.8a4.163,4.163,0,1,0,4.163,4.163A4.168,4.168,0,0,0,149.967,145.8Z" data-name="Path 6" id="Path_6"></path>
                                    </g>
                                </g>
                                <g data-name="Group 68" id="Group_68">
                                    <g data-name="Group 67" id="Group_67">
                                        <path fill="#000" d="M14.517,0H5.483A5.489,5.489,0,0,0,0,5.483v9.035A5.489,5.489,0,0,0,5.483,20h9.035A5.489,5.489,0,0,0,20,14.517V5.483A5.489,5.489,0,0,0,14.517,0ZM10,15.486A5.486,5.486,0,1,1,15.486,10,5.492,5.492,0,0,1,10,15.486Zm5.814-9.633A1.667,1.667,0,1,1,17.48,4.186,1.669,1.669,0,0,1,15.814,5.853Z" data-name="Path 7" id="Path_7"></path>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" id="whatsapp">
                                <path fill="#000" d="M16 0C7.163 0 0 6.87 0 15.344c0 2.706.73 5.3 2.108 7.593L0 32l9.353-2.411C11.47 30.575 13.72 31 16 31c8.837 0 16-6.87 16-15.344C32 6.87 24.837 0 16 0zm0 28.497c-2.07 0-4.094-.46-5.927-1.338l-.424-.202-5.553 1.43 1.48-5.4-.276-.44C3.923 20.377 3 17.918 3 15.344 3 8.56 8.935 3 16 3s13 5.56 13 12.344c0 6.784-5.935 13.153-13 13.153zm7.327-8.184c-.402-.2-2.377-1.173-2.746-1.306-.369-.133-.638-.2-.906.2-.268.4-1.039 1.306-1.273 1.573-.234.267-.469.3-.871.1-2.377-1.173-3.944-2.947-4.444-3.44-.369-.4-.312-.613-.117-.813.201-.2.469-.5.67-.733.234-.267.312-.447.469-.747.157-.3.079-.566-.04-.8-.117-.234-1.062-2.562-1.454-3.513-.383-.92-.774-.797-1.062-.813l-.905-.013c-.268 0-.703.1-1.07.5-.368.4-1.403 1.373-1.403 3.347s1.436 3.88 1.636 4.146c.201.267 2.822 4.48 6.838 6.276.955.413 1.698.66 2.276.846.956.305 1.824.262 2.51.159.765-.114 2.377-.97 2.712-1.906.335-.937.335-1.739.234-1.906-.101-.167-.369-.267-.77-.467z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg viewBox="0 0 19.738 22.466" height="22.466" width="19.738" xmlns="http://www.w3.org/2000/svg" data-name="Group 101" id="Group_101">
                                <path fill="#000" transform="translate(-31.423 -0.39)" d="M51.151,6.015a5.661,5.661,0,0,1-3.42-1.143A5.662,5.662,0,0,1,45.469.39H41.8V10.414l0,5.49a3.325,3.325,0,1,1-2.281-3.151V9.029a7.218,7.218,0,0,0-1.058-.078,7.034,7.034,0,0,0-5.286,2.364,6.893,6.893,0,0,0,.311,9.505,7.158,7.158,0,0,0,.663.579,7.035,7.035,0,0,0,4.312,1.458,7.219,7.219,0,0,0,1.058-.078,7.011,7.011,0,0,0,3.917-1.959,6.868,6.868,0,0,0,2.06-4.887l-.019-8.2a9.3,9.3,0,0,0,5.688,1.933V6.014h-.011Z" data-name="Path 6566" id="Path_6566"></path>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <div className='container-footer'>
                <p className='footer-text'>© 2025 اسم المتجر. جميع الحقوق محفوظة.</p>
            </div>

            {isBottomButtonVisible && (
                <button
                    className='btn-buy-bottom'
                    onClick={() => scrollToSection(buyRef)}
                    style={{
                        position: 'fixed',
                        height: '50px',
                        width: '80%',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 1000,
                        fontSize: '1.1em',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#388e3c'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#4caf50'}
                >
                    اشتر الآن
                </button>
            )}

            {showConfirmation && (
                <div style={styles.popupOverlay}>
                    <div style={{ ...styles.popupBox, textAlign: 'right' }}>
                        <h2>تأكيد الطلب</h2>
                        <p>يرجى مراجعة تفاصيل طلبك:</p>
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <p><strong>الاسم:</strong> {formData.name}</p>
                            <p><strong>البريد الإلكتروني:</strong> {formData.email || 'غير متوفر'}</p>
                            <p><strong>رقم الهاتف:</strong> {formData.phone}</p>
                            <p><strong>الذاكرة العشوائية:</strong> {formData.ram}</p>
                            <p><strong>التخزين:</strong> {formData.storage}</p>
                            <p><strong>عدد بطاقات SIM:</strong> {formData.sim}</p>
                            <p><strong>اللون:</strong> {formData.color}</p>
                            <p><strong>الولاية:</strong> {formData.wilaya}</p>
                            <p><strong>موقع التوصيل:</strong> {formData.location === 'home' ? 'المنزل' : 'المكتب'}</p>
                            <p><strong>العنوان:</strong> {formData.address}</p>
                            <p><strong>الكمية:</strong> {formData.quantity}</p>
                            <p><strong>سعر التوصيل:</strong> {formData.priceDelivery.toLocaleString('ar-DZ')} دج</p>
                            <p><strong>السعر الإجمالي:</strong> {formData.totalPrice.toLocaleString('ar-DZ')} دج</p>
                        </div>
                        {isLoading ? (
                            <p style={{ color: '#4caf50', fontWeight: 'bold' }}>جاري إرسال الطلب...</p>
                        ) : (
                            <div>
                                <button
                                    onClick={handleConfirmOrder}
                                    style={styles.confirmButton}
                                >
                                    تأكيد
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    style={styles.cancelButton}
                                >
                                    إلغاء
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div style={styles.popupOverlay}>
                    <div style={{ ...styles.popupBox, textAlign: 'center' }}>
                        <div style={styles.checkmark}>&#10004;</div>
                        <h2>تم الطلب بنجاح!</h2>
                        <p>شكرًا لشرائك.</p>
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            style={styles.closeButton}
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const ArabicWilayas = () => (
    <>
        <option value="16">16 - الجزائر</option>
        <option value="17">17 - الجلفة</option>
        <option value="18">18 - جيجل</option>
        <option value="19">19 - سطيف</option>
        <option value="20">20 - سعيدة</option>
        <option value="21">21 - سكيكدة</option>
        <option value="22">22 - سيدي بلعباس</option>
        <option value="23">23 - عنابة</option>
        <option value="24">24 - قالمة</option>
        <option value="25">25 - قسنطينة</option>
        <option value="26">26 - المدية</option>
        <option value="27">27 - مستغانم</option>
        <option value="28">28 - المسيلة</option>
        <option value="29">29 - معسكر</option>
        <option value="30">30 - ورقلة</option>
        <option value="31">31 - وهران</option>
        <option value="32">32 - البيض</option>
        <option value="33">33 - إليزي</option>
        <option value="34">34 - برج بوعريريج</option>
        <option value="35">35 - بومرداس</option>
        <option value="36">36 - الطارف</option>
        <option value="37">37 - تندوف</option>
        <option value="38">38 - تيسمسيلت</option>
        <option value="39">39 - الوادي</option>
        <option value="40">40 - خنشلة</option>
        <option value="41">41 - سوق أهراس</option>
        <option value="42">42 - تيبازة</option>
        <option value="43">43 - ميلة</option>
        <option value="44">44 - عين الدفلى</option>
        <option value="45">45 - النعامة</option>
        <option value="46">46 - عين تيموشنت</option>
        <option value="47">47 - غرداية</option>
        <option value="48">48 - غليزان</option>
        <option value="49">49 - المغير</option>
        <option value="50">50 - المنيعة</option>
        <option value="51">51 - أولاد جلال</option>
        <option value="52">52 - برج باجي مختار</option>
        <option value="53">53 - بني عباس</option>
        <option value="54">54 - تيميمون</option>
        <option value="55">55 - توقرت</option>
        <option value="56">56 - جانت</option>
        <option value="57">57 - عين صالح</option>
        <option value="58">58 - عين قزام</option>
    </>
);

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
        marginLeft: '10px'
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