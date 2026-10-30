-- ========================================================
-- Roshani Traders - Three Wheeler Auto Parts Management System
-- MySQL 8.0.46 Database Seed Data (Idempotent)
-- ========================================================

USE `roshani_traders`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Seed Categories (10 Auto Rickshaw Categories)
-- --------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`) VALUES
(1, 'Body Parts & Panels', 'body-parts-panels', 'Front & rear wheel mudguards (majgad), dashboard consoles, side quarter panels & hoods', '/images/products/mudguard-set.webp', 'active'),
(2, 'Bumpers & Protection Guards', 'bumpers-protection-guards', 'Heavy duty tubular steel front bumpers, rear passenger crash guards & anti-collision bars', '/images/products/front-bumper.webp', 'active'),
(3, 'Side Mirrors & Rear View', 'side-mirrors-rear-view', 'Convex wide-angle side mirrors, chrome heritage mirror sets & vibration-resistant swivel mounts', '/images/products/convex-side-mirror.webp', 'active'),
(4, 'Lights & Indicators', 'lights-indicators', 'High-intensity halogen headlights, LED multi-function rear taillight clusters & amber turn indicators', '/images/products/headlight-assembly.webp', 'active'),
(5, 'Brake Systems & Drums', 'brake-systems-drums', 'High-friction semi-metallic brake shoes, cast-iron ribbed brake drums & master cylinders', '/images/products/brake-shoe-set.webp', 'active'),
(6, 'Engine & Clutch Parts', 'engine-clutch-parts', 'Cylinder blocks, piston assemblies, clutch plates, carburetors & performance overhaul kits', '/images/products/cylinder-piston-kit.webp', 'active'),
(7, 'Suspension & Shock Absorbers', 'suspension-shock-absorbers', 'Heavy load hydraulic front shock absorbers, rear leaf spring bushes & shackle overhaul kits', '/images/products/front-shock-absorber.webp', 'active'),
(8, 'Electrical & Wiring', 'electrical-wiring', 'Ignition switch lock assemblies, copper battery wiring harnesses, wiper motors & analog speedometers', '/images/products/ignition-switch.webp', 'active'),
(9, 'Decorative Items & Chrome Badges', 'decorative-items-chrome-badges', 'Stop Mono chrome emblems, Dera Patty Inco stainless strips, vintage Morris badges & chrome wheel caps', '/images/products/chrome-led-emblem.webp', 'active'),
(10, 'Accessories & Canopies', 'accessories-canopies', 'Waterproof 600D PVC cabin rain canopies, luxury quilted leatherette seat covers & soft touch rubber handle grips', '/images/products/rain-canopy.webp', 'active')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `image` = VALUES(`image`),
  `status` = VALUES(`status`);

-- --------------------------------------------------------
-- 2. Seed Users (Admin & Wholesale Customers)
-- Password: Admin@123456 (Admin), Customer@123456 (Customers)
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `business_name`, `mobile`, `email`, `password`, `address`, `city`, `role`, `status`) VALUES
(1, 'Roshani Traders Admin', 'Roshani Traders Head Office', '+91 98929 87454', 'admin@roshanitraders.com', '$2a$10$NjGCBxFdFAtzCqpIc9r62.HIAPBZJPTFtyVjwCupNvEOHTupta3za', 'Ajit Glass, Swami Vivekanand Rd, nr. Himalaya hotel, Behram Baug, Jogeshwari West', 'Mumbai', 'admin', 'active'),
(2, 'Rajesh Kumar', 'Metro Auto Spares & Accessories', '+91 98123 45678', 'customer@autocenter.com', '$2a$10$Y2gGl.TF3Jw8sgCZ19o1Te3Ep2nXQ0GGySuKTh7TJa/W0VJCJ3UVm', 'Shop 14, Main Market, Transport Nagar', 'Jaipur', 'customer', 'active'),
(3, 'Mohammed Farooq', 'Deccan Three Wheeler Hub', '+91 98490 12345', 'farooq@deccanauto.com', '$2a$10$Y2gGl.TF3Jw8sgCZ19o1Te3Ep2nXQ0GGySuKTh7TJa/W0VJCJ3UVm', 'Plot 88, Auto Nagar, Ranigunj', 'Hyderabad', 'customer', 'active'),
(4, 'Suresh Patel', 'Gujarat Auto Spares Syndicate', '+91 98250 54321', 'suresh@patelauto.com', '$2a$10$Y2gGl.TF3Jw8sgCZ19o1Te3Ep2nXQ0GGySuKTh7TJa/W0VJCJ3UVm', 'Shop 5, Gandhi Road Motor Market', 'Ahmedabad', 'customer', 'active')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `business_name` = VALUES(`business_name`),
  `mobile` = VALUES(`mobile`),
  `password` = VALUES(`password`),
  `address` = VALUES(`address`),
  `city` = VALUES(`city`),

  `role` = VALUES(`role`),
  `status` = VALUES(`status`);

-- --------------------------------------------------------
-- 3. Seed Products (All 28 Official Roshani Traders Products)
-- --------------------------------------------------------
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `brand`, `price`, `moq`, `stock`, `availability`, `image`, `specifications`, `compatible_models`, `status`) VALUES
-- Category 1: Body Parts & Panels
(1, 1, 'Bajaj RE Front & Rear Wheel Mudguard Set (Majgad)', 'bajaj-re-front-rear-mudguard-set', 'Heavy-duty black polypropylene front and rear mudguard splash guards engineered for Bajaj RE auto rickshaws. Resists road debris, stone chips and heavy water splashing.', 'Roshani Armor', 850.00, 10, 120, 1, '/images/products/mudguard-set.webp',
  '{"Material": "High-Density Polypropylene", "Color": "Matte Jet Black", "Finish": "Scratch Resistant Textured Finish", "Fitting Position": "Front Wheel & Rear Left/Right Mudflaps", "Warranty": "6 Months Wholesale Warranty"}',
  '["Bajaj RE Compact 2S", "Bajaj RE Compact 4S", "Bajaj Maxima Z"]', 'active'),

(2, 1, 'Custom Molded Three Wheeler Dashboard Console Assembly', 'three-wheeler-dashboard-console-assembly', 'Complete black virgin ABS dashboard assembly housing speedometer cutout, glove box compartment, ignition switch slot, and toggle switch panels.', 'Roshani OEM', 1250.00, 5, 80, 1, '/images/products/dashboard-console.webp',
  '{"Material": "Virgin High-Impact ABS Thermoplastic", "Color": "Textured Black", "Cutouts": "Speedometer gauge, ignition key slot, hazard switch, indicator LEDs", "Glove Compartment": "Lockable front utility box with brass tumbler"}',
  '["Bajaj RE Compact", "Bajaj RE Optima", "TVS King Deluxe"]', 'active'),

-- Category 2: Bumpers & Protection Guards
(3, 2, 'Bajaj RE Front Bumper - Heavy Duty Steel', 'bajaj-re-front-bumper-heavy-duty-steel', 'Heavy-duty front crash protection tubular steel bumper with satin black anti-rust powder coating. Designed for heavy city stop-and-go commercial driving conditions.', 'Roshani Armor', 1450.00, 5, 150, 1, '/images/products/front-bumper.webp',
  '{"Material": "Seamless Heavy Gauge Mild Steel Pipe", "Coating": "7-Tank Phosphate Anti-Rust Primer + Satin Black Powder Coat", "Wall Thickness": "2.5 mm High Impact Pipe", "Mounting": "Direct Chassis Bolt-On (Hardware Included)"}',
  '["Bajaj RE 2-Stroke", "Bajaj RE 4-Stroke", "Bajaj Compact"]', 'active'),

(4, 2, 'Universal Rear Bumper Bar with Safety Reflector', 'universal-rear-bumper-bar-safety-reflector', 'Reinforced cold-rolled tubular rear bumper with two integrated red safety prismatic reflectors for maximum nighttime highway and city visibility.', 'Roshani Armor', 1150.00, 5, 130, 1, '/images/products/rear-bumper.webp',
  '{"Material": "Reinforced Tubular Cold Rolled Steel", "Reflectors": "2x Prismatic E-Mark Certified Red Safety Reflectors", "Coating": "Anti-Corrosion Matte Black Finish", "Length": "1220 mm Standard Commercial Width"}',
  '["Bajaj RE", "Piaggio Ape City", "TVS King", "Mahindra Alfa"]', 'active'),

-- Category 3: Side Mirrors & Rear View
(5, 3, 'Auto Rickshaw Convex Side Mirror Pair', 'auto-rickshaw-convex-side-mirror-pair', 'Durable high-clarity convex side mirrors with vibration-resistant ball swivel joints. Eliminates blind spots for passenger auto drivers.', 'Roshani ClearView', 280.00, 20, 400, 1, '/images/products/convex-side-mirror.webp',
  '{"Glass Type": "Wide-Angle High Clarity Convex Mirror", "Housing": "Weatherproof Polycarbonate Casing", "Bracket": "Vibration-Resistant Ball-and-Socket Swivel Mount", "Pack Size": "Pair (Left & Right Mirrors Included)"}',
  '["Bajaj RE", "TVS King", "Piaggio Ape", "Atul Shakti", "Mahindra Alfa"]', 'active'),

(6, 3, 'Chrome Plated Auto Rickshaw Mirror Set', 'chrome-plated-auto-rickshaw-mirror-set', 'Vintage heritage styled side mirrors finished in multi-layer gleaming chrome plating with distortion-free automotive glass and stainless steel extension arms.', 'Roshani Glam', 420.00, 15, 250, 1, '/images/products/chrome-mirror-set.webp',
  '{"Plating": "Multi-Layer Nickel-Chrome Mirror Electroplate", "Reflectivity": "Grade-A Distortion-Free Automotive Glass", "Mount Arm": "Adjustable Stainless Steel Extension Stem", "Style": "Heritage Indian Commercial Auto Styling"}',
  '["Bajaj RE", "TVS King Deluxe", "Piaggio Ape City"]', 'active'),

-- Category 4: Lights & Indicators
(7, 4, 'Auto Rickshaw High Intensity Headlight Assembly', 'auto-rickshaw-high-intensity-headlight-assembly', 'Complete crystal-clear headlight unit with high throw vacuum-aluminized reflector and UV-treated hard polycarbonate outer lens.', 'Roshani Lumina', 580.00, 10, 200, 1, '/images/products/headlight-assembly.webp',
  '{"Lens": "UV-Stabilized Hard-Coated Clear Polycarbonate", "Reflector": "Vacuum-Aluminized High Throw Reflector Cup", "Bulb Fitment": "Standard H4 12V 35/35W or LED Drop-in", "Water Resistance": "IP65 Rated Perimeter Rubber Gasket"}',
  '["Bajaj RE Compact", "Bajaj RE 4S", "TVS King"]', 'active'),

(8, 4, 'LED Multi-Function Rear Tail Light Pair', 'led-multi-function-rear-tail-light-pair', '36-SMD bright LED tail light clusters with integrated running light, bright brake alert, and clear reverse indicator lenses. Low 12V power draw.', 'Roshani Lumina', 620.00, 10, 220, 1, '/images/products/led-tail-light.webp',
  '{"Functions": "Parking Light (Red), Brake Light (Bright Red), Reverse Light (White)", "LED Count": "36 High-Flux SMD LEDs Per Cluster", "Operating Voltage": "12V DC Low Power Draw", "Connector": "Standard 4-Pin Waterproof Pigtail Harness"}',
  '["Bajaj RE", "Piaggio Ape", "TVS King", "Mahindra Alfa"]', 'active'),

(9, 4, 'Side Indicator Amber Light Lens Pack (Set of 4)', 'side-indicator-amber-light-lens-pack', 'Pack of 4 faceted amber turn signal indicator assemblies with flexible vibration-absorbing rubber boot stems to prevent breakage on impact.', 'Roshani Lumina', 290.00, 20, 350, 1, '/images/products/indicator-light-pack.webp',
  '{"Color": "Deep Amber / Chrome Rim", "Lens Style": "Diamond-Cut Faceted Signal Dispersion", "Mount": "Flexible Rubber Boot Shock-Absorbing Stem", "Quantity": "Complete Set of 4 (2 Front + 2 Rear Indicators)"}',
  '["Bajaj RE Compact", "Bajaj 2S", "TVS King", "Piaggio Ape"]', 'active'),

-- Category 5: Brake Systems & Drums
(10, 5, 'TVS King & Bajaj RE Heavy Duty Brake Shoe Set', 'tvs-king-bajaj-re-heavy-duty-brake-shoe-set', 'Non-asbestos semi-metallic high friction brake shoes providing fade-free stopping power up to 350°C in heavy city passenger traffic.', 'Roshani StopMax', 480.00, 15, 300, 1, '/images/products/brake-shoe-set.webp',
  '{"Friction Compound": "Non-Asbestos Organic Semi-Metallic Friction Liner", "Base Metal": "High Pressure Die-Cast Aluminum Shoe", "Operating Temp": "Fade-Free Up To 350°C Heavy City Traffic", "Pack Quantity": "4 Brake Shoes (Complete Axle Set)"}',
  '["Bajaj RE Compact", "Bajaj 4S", "TVS King Deluxe", "TVS King Kargo"]', 'active'),

(11, 5, 'Piaggio Ape Heavy Duty Brake Drum Assembly', 'piaggio-ape-heavy-duty-brake-drum-assembly', 'Pearlitic grey cast iron brake drum with CNC precision-turned inner friction track and radial heat-dissipating cooling ribs.', 'Roshani StopMax', 1100.00, 6, 140, 1, '/images/products/brake-drum.webp',
  '{"Material": "High-Grade Pearlitic Gray Cast Iron (Grade 250)", "Machining": "CNC Precision Turned Inner Braking Surface", "Heat Dissipation": "Radial Perimeter Cooling Fins", "Dynamic Balance": "100% Dynamically Balanced To Eliminate Vibration"}',
  '["Piaggio Ape City", "Piaggio Ape Dlx", "Piaggio Ape Xtra LDX"]', 'active'),

-- Category 6: Engine & Clutch Parts
(12, 6, 'Bajaj RE 205cc Cylinder Block & Piston Kit', 'bajaj-re-205cc-cylinder-block-piston-kit', 'Factory tolerance cylinder block, moly-coated aluminum piston, piston rings, gudgeon pin, and circlips engineered for Bajaj RE 4-stroke 205cc commercial engines.', 'Roshani PowerTech', 2850.00, 4, 65, 1, '/images/products/cylinder-piston-kit.webp',
  '{"Displacement": "205cc 4-Stroke Air-Cooled Standard Bore", "Cylinder Material": "Cast Iron Sleeve with High Cooling Aluminum Fins", "Piston": "Moly-Coated Lightweight Aluminum Alloy Piston", "Kit Contents": "Cylinder Block, Piston, Rings, Gudgeon Pin, Circlips, Head Gasket"}',
  '["Bajaj RE Compact 4S", "Bajaj RE 205 Dtsi", "Bajaj Maxima C"]', 'active'),

(13, 6, 'Heavy Duty Clutch Plate & Pressure Plate Kit', 'heavy-duty-clutch-plate-pressure-plate-kit', 'Kevlar-infused friction clutch disc with heat-treated spring steel diaphragm pressure plate for smooth chatter-free stop-and-go commercial driving.', 'Roshani PowerTech', 920.00, 8, 180, 1, '/images/products/clutch-plate-kit.webp',
  '{"Facing Material": "High-Coefficient Kevlar-Infused Friction Facing", "Diaphragm Spring": "High Carbon Spring Steel Heat Treated", "Engagement": "Smooth Chatter-Free City Stop-and-Go Engagement", "Includes": "1x Clutch Friction Plate, 1x Clutch Pressure Plate"}',
  '["Bajaj RE Compact", "Bajaj 2S", "TVS King", "Piaggio Ape"]', 'active'),

(14, 6, 'Carburetor Assembly for Bajaj RE 2-Stroke & 4-Stroke', 'carburetor-assembly-bajaj-re', 'Precision die-cast alloy carburetor calibrated for superior fuel atomization, stable idling, and maximum mileage in stop-and-go passenger operation.', 'Roshani PowerTech', 1350.00, 5, 110, 1, '/images/products/carburetor-assembly.webp',
  '{"Choke Type": "Manual Cable-Operated Cold Start Choke", "Jetting": "Factory Calibrated High-Mileage Air/Fuel Jets", "Construction": "Die-Cast Zinc-Aluminum Alloy Body", "Fuel Economy": "Optimized For Maximum Mileage In Stop-and-Go Traffic"}',
  '["Bajaj RE 2S", "Bajaj RE 4S Compact", "Bajaj Optima"]', 'active'),

-- Category 7: Suspension & Shock Absorbers
(15, 7, 'Front Hydraulic Shock Absorber Assembly', 'front-hydraulic-shock-absorber-assembly', 'Twin-tube hydraulic damping shock absorber with progressive high-tensile coil spring and hard chrome plated shaft for passenger comfort.', 'Roshani Suspension', 780.00, 8, 160, 1, '/images/products/front-shock-absorber.webp',
  '{"Damping Type": "Twin-Tube Hydraulic Oil Damped with Heavy Spring", "Piston Rod": "Hard Chrome Plated Micro-Polished Steel Shaft", "Spring Finish": "Black Powder Coated High-Tensile Steel Coil", "Stroke Length": "115 mm Optimized Passenger Comfort Travel"}',
  '["Bajaj RE Compact", "Bajaj 4S", "TVS King"]', 'active'),

(16, 7, 'Rear Suspension Bush & Pin Kit (12 Pcs)', 'rear-suspension-bush-pin-kit', 'Wear-resistant polyurethane suspension bushings and case-hardened ground shackle pins for complete rear leaf spring overhaul.', 'Roshani Suspension', 320.00, 20, 320, 1, '/images/products/suspension-bush-pin-kit.webp',
  '{"Bush Material": "Heavy-Duty Wear-Resistant Polyurethane Elastomer", "Pins": "Case-Hardened Carbon Steel Ground Shackle Pins", "Kit Quantity": "12 Pieces (Full Rear Leaf Spring Overhaul)", "Grease Nipples": "Standard Hex Threaded Grease Fittings Included"}',
  '["Bajaj RE", "Piaggio Ape", "Mahindra Alfa", "Atul Gem"]', 'active'),

-- Category 8: Electrical & Wiring
(17, 8, 'Ignition Switch Lock Assembly with 2 Master Keys', 'ignition-switch-lock-assembly-2-keys', 'Anti-theft zinc core ignition switch lock with silver contacts and two brass nickel-plated keys with ergonomic plastic grips.', 'Roshani Electra', 310.00, 15, 240, 1, '/images/products/ignition-switch.webp',
  '{"Key Positions": "OFF / ON / IGNITION START", "Electrical Rating": "12V 30A Heavy Silver Contact Points", "Housing": "Die-Cast Zinc Lock Core with Anti-Theft Shutter", "Keys": "2x Brass Nickel-Plated Ergonomic Keys"}',
  '["Bajaj RE Compact", "Bajaj 2S", "Bajaj 4S", "TVS King"]', 'active'),

(18, 8, 'Heavy Duty 100% Copper Battery Wiring Harness Cable', 'heavy-duty-battery-wiring-harness-cable', '100% multi-strand oxygen-free electrolytic copper starter and ground battery cable with tin-plated forged brass terminal lugs.', 'Roshani Electra', 450.00, 10, 210, 1, '/images/products/battery-wiring-cable.webp',
  '{"Conductor": "100% Electrolytic Oxygen-Free Multi-Strand Copper", "Wire Gauge": "16 sq mm Main Starter Lead + 10 sq mm Earth Cable", "Insulation": "Flame-Retardant Oil & Acid Resistant PVC Sheathing", "Terminals": "Heavy Duty Tin-Coated Forged Brass Battery Lugs"}',
  '["Bajaj RE", "Piaggio Ape", "TVS King", "Mahindra Alfa"]', 'active'),

(19, 8, 'Wiper Motor Assembly 12V DC with Arm & Blade', 'wiper-motor-assembly-12v-dc-arm-blade', 'Permanent magnet 12V DC high-torque wiper motor assembly with stainless steel linkage arm and 16-inch graphite rubber squeegee blade.', 'Roshani Electra', 890.00, 6, 120, 1, '/images/products/wiper-motor.webp',
  '{"Operating Voltage": "12V DC High-Torque Permanent Magnet Motor", "Sweep Angle": "105° Full Driver Windshield Sweep", "Arm Construction": "Stainless Steel Anti-Corrosion Arm", "Blade Size": "16-Inch Graphite Coated All-Weather Rubber Squeegee"}',
  '["Bajaj RE Compact", "Bajaj Optima", "TVS King Deluxe", "Piaggio Ape"]', 'active'),

(20, 8, 'Speedometer Gauge Meter Assembly (Bajaj RE 4-Stroke)', 'speedometer-gauge-meter-assembly-bajaj-re', 'Analog dashboard speedometer with 0-80 km/h speed sweep, 6-digit odometer, high-beam indicator, neutral light, and backlighting.', 'Roshani Electra', 740.00, 8, 140, 1, '/images/products/speedometer-meter.webp',
  '{"Speed Range": "0 - 80 km/h High Contrast Analog Dial", "Odometer": "6-Digit Mechanical Total Distance Counter", "Indicators": "Neutral, High Beam, Left/Right Turn LED Backlights", "Lens": "Scratch-Proof Crystal Clear Acrylic Dome"}',
  '["Bajaj RE Compact 4S", "Bajaj RE 205cc", "Bajaj Maxima Z"]', 'active'),

-- Category 9: Decorative Items & Chrome Badges
(21, 9, 'Stop Mono Chrome Emblem & LED Reflector Light', 'stop-mono-chrome-emblem-led-reflector-light', 'High luster triple-chrome plated Stop Mono emblem badge with integrated bright red LED stop reflector ring for Bajaj RE and TVS King.', 'Roshani Glam', 340.00, 15, 300, 1, '/images/products/chrome-led-emblem.webp',
  '{"Finish": "Triple Nickel-Chrome High Glaze Mirror Plating", "Lighting": "Integrated Red LED Ring for Brake Illumination", "Voltage": "12V DC Automotive Standard", "Mounting": "Industrial High-Tack 3M VHB Adhesive Backing + Studs"}',
  '["Bajaj RE", "TVS King", "Piaggio Ape", "Mahindra Alfa"]', 'active'),

(22, 9, 'Dera Patty Inco Stainless Steel Side Strip Set', 'dera-patty-inco-stainless-steel-side-strip-set', 'Complete left and right side protective stainless steel trim strips with embossed fluted pattern. Resists scratches and side impacts.', 'Roshani Glam', 580.00, 10, 190, 1, '/images/products/stainless-steel-side-strips.webp',
  '{"Material": "Grade 304 High-Polish Austenitic Stainless Steel", "Gauge": "1.2 mm Heavy Duty Scuff-Protection Profile", "Width": "50 mm Decorative Fluted Embossed Pattern", "Set Contents": "Complete Left and Right Cabin Side Molding Strips"}',
  '["Bajaj RE Compact", "Bajaj 2S", "Bajaj 4S"]', 'active'),

(23, 9, 'Monogram Morris Vintage Chrome Badge Emblem', 'monogram-morris-vintage-chrome-badge-emblem', 'Classic retro 3D script raised-letter chrome auto emblem badge. Triple nickel-chrome plated, sun-fade and car-wash resistant.', 'Roshani Glam', 260.00, 20, 350, 1, '/images/products/vintage-chrome-badge.webp',
  '{"Style": "Classic Retro Raised-Letter 3D Script Emblem", "Finish": "Mirror Polished Chrome Electroplate", "Resistance": "UV, Sun Fade, & High-Pressure Wash Resistant", "Dimensions": "180 mm Length x 35 mm Height"}',
  '["Bajaj RE", "Piaggio Ape", "TVS King", "Custom Three Wheelers"]', 'active'),

(24, 9, 'Aerodynamic Roof Spoiler with Integrated LED Brake Light', 'aerodynamic-roof-spoiler-integrated-led-brake-light', 'Lightweight rigid fiberglass roof spoiler in gloss black with integrated 18-LED third brake light. Clamp-on mounting with no drilling.', 'Roshani Glam', 1150.00, 5, 90, 1, '/images/products/roof-spoiler.webp',
  '{"Material": "Lightweight High-Rigidity Fiberglass Composite", "Finish": "High-Gloss Jet Black UV Polyurethane Coat", "LED Unit": "18-LED High-Mount Third Brake Light Strip", "Fitting": "Roof Lip Clamp System (No Body Drilling Required)"}',
  '["Bajaj RE Compact", "Bajaj 4S", "TVS King Deluxe"]', 'active'),

(25, 9, 'Decorative Chrome Wheel Cap Cover Set (4 Pcs)', 'decorative-chrome-wheel-cap-cover-set', 'Set of 4 mirror chrome wheel cap covers with retention spring rings. Fits standard 8-inch and 10-inch three-wheeler wheels.', 'Roshani Glam', 480.00, 12, 260, 1, '/images/products/chrome-wheel-caps.webp',
  '{"Rim Size": "Fits Standard 8-Inch and 10-Inch Auto Rickshaw Rims", "Finish": "Deep Mirror Chrome Coating with Amber Center Star", "Retention": "Heavy Duty Spring Steel Locking Ring", "Pack Quantity": "Complete Set of 4 Wheel Cap Covers"}',
  '["Bajaj RE", "Piaggio Ape", "TVS King", "Mahindra Alfa"]', 'active'),

-- Category 10: Accessories & Canopies
(26, 10, 'Waterproof Cabin Rain Canopy Cover (600D PVC)', 'waterproof-cabin-rain-canopy-cover-600d-pvc', 'Monsoon-ready heavy-duty 600D PVC coated polyester rain canopy cover with heat-sealed seams and clear vinyl passenger viewing windows.', 'Roshani AllWeather', 1650.00, 4, 85, 1, '/images/products/rain-canopy.webp',
  '{"Fabric": "600D Heavy PVC Coated Ripstop Oxford Fabric", "Water Resistance": "100% Monsoon Waterproof Heat-Sealed Seams", "Windows": "Military Grade Optical-Clear Flexible Vinyl Windows", "Fastening": "Heavy Brass Grommets & Nylon Tie-Down Cords"}',
  '["Bajaj RE Compact", "Bajaj RE 4S", "TVS King", "Piaggio Ape"]', 'active'),

(27, 10, 'Luxury Leatherette Auto Rickshaw Seat Cover Set', 'luxury-leatherette-auto-rickshaw-seat-cover-set', 'High-density vinyl leatherette seat cover set with 12 mm orthopedic foam padding and double-diamond stitched pattern for driver and passenger seats.', 'Roshani AllWeather', 820.00, 10, 175, 1, '/images/products/leatherette-seat-cover.webp',
  '{"Material": "Premium Breathable Automotive Vinyl Leatherette", "Cushioning": "12 mm High-Density Orthopedic Memory Foam Backing", "Stitching": "Double-Diamond Quilted Contrast Gold Stitching", "Set Includes": "Driver Front Bench + Rear Passenger 3-Seater Cushion Covers"}',
  '["Bajaj RE Compact", "Bajaj 2S", "Bajaj 4S"]', 'active'),

(28, 10, 'Soft Touch Anti-Slip Rubber Handle Grip Set', 'soft-touch-anti-slip-rubber-handle-grip-set', 'Ergonomic ribbed vibration-damping EPDM rubber handlebar grips for throttle and clutch sides. High friction surface for all-day grip.', 'Roshani AllWeather', 180.00, 25, 450, 1, '/images/products/rubber-handle-grips.webp',
  '{"Material": "Vibration-Damping Soft Synthetic EPDM Rubber", "Pattern": "Waffle Diamond Anti-Slip Wet Weather Texture", "Fitment": "Standard 22 mm Three-Wheeler Handlebar Tube", "Contents": "Pair of 2 Handlebar Grips (Throttle & Clutch Sides)"}',
  '["Bajaj RE", "TVS King", "Piaggio Ape", "Mahindra Alfa"]', 'active')

ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `brand` = VALUES(`brand`),
  `price` = VALUES(`price`),
  `moq` = VALUES(`moq`),
  `stock` = VALUES(`stock`),
  `availability` = VALUES(`availability`),
  `image` = VALUES(`image`),
  `specifications` = VALUES(`specifications`),
  `compatible_models` = VALUES(`compatible_models`),
  `status` = VALUES(`status`);

-- --------------------------------------------------------
-- 4. Seed CMS Contents (Homepage, About, Contact)
-- --------------------------------------------------------
INSERT INTO `contents` (`id`, `page`, `section`, `title`, `description`, `image`, `data`) VALUES
(1, 'home', 'hero', 'India''s Premier Three Wheeler Auto Parts Wholesale Hub', 'Direct bulk supplies of genuine auto rickshaw spare parts, body panels, bumpers, engine overhaul kits, and decorative accessories for Bajaj RE, TVS King, and Piaggio Ape.', '/images/products/mudguard-set.webp',
  '{"phone": "+91 98929 87454", "email": "sales@roshanitraders.com", "badge": "WHOLESALE ONLY • PAN-INDIA DISPATCH"}'),

(2, 'about', 'main', 'About Roshani Traders', 'Established in Mumbai, Roshani Traders is a trusted supplier of premium quality three wheeler auto rickshaw spare parts to retailers, garages, and transport fleets across India.', '/images/products/front-bumper.webp',
  '{"experience": "25+ Years in Auto Spares", "godowns": "Bhiwandi & Jogeshwari Wholesale Hubs", "delivery": "Daily Godown Transporters Dispatch"}'),

(3, 'contact', 'main', 'Contact Roshani Traders Wholesale Desk', 'Connect with our dedicated wholesale dispatch managers for bulk inquiries, model compatibility, and custom logistics booking.', NULL,
  '{"phone": "+91 98929 87454", "email": "sales@roshanitraders.com", "address": "Ajit Glass, Swami Vivekanand Rd, nr. Himalaya hotel, Behram Baug, Jogeshwari West, Mumbai, MH - 400102"}')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `image` = VALUES(`image`),
  `data` = VALUES(`data`);

-- --------------------------------------------------------
-- 5. Seed FAQs (Common Wholesale Auto Parts Queries)
-- --------------------------------------------------------
INSERT INTO `faqs` (`id`, `question`, `answer`, `status`) VALUES
(1, 'What is the Minimum Order Quantity (MOQ) at Roshani Traders?', 'Each auto part in our catalogue has a clearly displayed MOQ tailored for wholesale trade (usually 4 to 25 units depending on the part). We fulfill carton pack sizes for auto parts retailers and repair garages.', 'active'),
(2, 'How does pan-India dispatch and transport godown delivery work?', 'We ship daily through leading commercial transporters (e.g., VRL Logistics, TCI Express, ARC, Southern Roadways). Orders confirmed by 2 PM are handed over to the transport godown the same business day.', 'active'),
(3, 'Are your parts compatible with both 2-Stroke and 4-Stroke auto rickshaws?', 'Yes! Every product page lists exact vehicle model compatibility (e.g. Bajaj RE Compact 2S/4S, TVS King Deluxe, Piaggio Ape City, Mahindra Alfa). Our AI Assistant can also immediately verify fitment.', 'active'),
(4, 'Can I get sample pieces before placing a full carton order?', 'Registered wholesale buyers can request sample cartons through our online Quotation Cart. Our admin review team confirms sample dispatch and adjustments.', 'active'),
(5, 'What payment modes are accepted for B2B orders?', 'We accept RTGS, NEFT, IMPS, Business UPI, and direct Bank Transfer. Orders are dispatched upon UTR confirmation.', 'active')
ON DUPLICATE KEY UPDATE
  `question` = VALUES(`question`),
  `answer` = VALUES(`answer`),
  `status` = VALUES(`status`);

-- --------------------------------------------------------
-- 6. Seed Sample Quotation & Quote Items
-- --------------------------------------------------------
INSERT INTO `quotes` (`id`, `user_id`, `quote_id`, `total_amount`, `remarks`, `status`, `tracking_status`, `tracking_number`, `current_location`, `tracking_history`) VALUES
(1, 2, 'RT-Q00001', 34250.00, '[Payment: Bank Transfer | UTR: HDFC89723401] Shop: Metro Auto Spares Jaipur', 'Confirmed', 'Packed', 'TRK-2026-JAIPUR-001', 'Roshani Central Warehouse, Bhiwandi, MH',
  '[{"status": "Order Placed", "location": "Roshani B2B Portal", "timestamp": "2026-10-28 10:30:00", "comment": "Wholesale order submitted by customer."}, {"status": "Packed", "location": "Roshani Central Warehouse, Bhiwandi, MH", "timestamp": "2026-10-29 14:00:00", "comment": "Order ACCEPTED & CONFIRMED by Admin! Goods packed in export wooden crates."}]')
ON DUPLICATE KEY UPDATE
  `total_amount` = VALUES(`total_amount`),
  `remarks` = VALUES(`remarks`),
  `status` = VALUES(`status`);

INSERT INTO `quote_items` (`id`, `quote_id`, `product_id`, `quantity`, `price_at_quote`, `subtotal`) VALUES
(1, 1, 1, 10, 850.00, 8500.00),
(2, 1, 3, 5, 1450.00, 7250.00),
(3, 1, 10, 15, 480.00, 7200.00),
(4, 1, 12, 4, 2850.00, 11300.00)
ON DUPLICATE KEY UPDATE
  `quantity` = VALUES(`quantity`),
  `price_at_quote` = VALUES(`price_at_quote`),
  `subtotal` = VALUES(`subtotal`);

-- --------------------------------------------------------
-- 7. Seed Sample Customer Enquiry
-- --------------------------------------------------------
INSERT INTO `enquiries` (`id`, `user_id`, `name`, `business_name`, `mobile`, `email`, `subject`, `message`, `status`, `ai_summary`) VALUES
(1, 2, 'Rajesh Kumar', 'Metro Auto Spares & Accessories', '+91 98123 45678', 'customer@autocenter.com', 'Bulk Inquiries for Bajaj RE 205cc Cylinder Blocks', 'We need regular monthly dispatch of 25 cylinder block kits and 50 clutch plates for our Rajasthan wholesale distribution network. Please send your best contract quotation.', 'In Review',
  '{"intent": "Bulk Wholesale Contract Inquiries", "priority": "High", "customerType": "Wholesale Distributor", "suggestedAction": "Prepare custom volume discount tier for cylinder blocks and clutch plates."}')
ON DUPLICATE KEY UPDATE
  `subject` = VALUES(`subject`),
  `message` = VALUES(`message`),
  `status` = VALUES(`status`);

SET FOREIGN_KEY_CHECKS = 1;
