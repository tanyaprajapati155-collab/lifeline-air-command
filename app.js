// Life-Line Air Autonomous Medical Drone Simulator
class DroneSimulator {
    constructor() {
        this.missionData = {
            "missionScenarios": [
                {
                    "id": 1,
                    "name": "Border Patrol Medical Emergency",
                    "description": "Wounded soldier at remote border outpost requires immediate medical supplies",
                    "location": {"lat": 28.7041, "lng": 77.1025},
                    "urgency": "critical",
                    "supplies": ["blood_type_o", "morphine", "bandages", "antibiotics"],
                    "weather": "clear",
                    "threatLevel": "medium"
                },
                {
                    "id": 2,
                    "name": "Mountain Rescue Operation",
                    "description": "Avalanche survivor needs emergency medication at high altitude",
                    "location": {"lat": 32.2734, "lng": 77.1734},
                    "urgency": "high",
                    "supplies": ["oxygen", "thermal_blankets", "pain_medication"],
                    "weather": "snow",
                    "threatLevel": "low"
                },
                {
                    "id": 3,
                    "name": "Forward Operating Base Resupply",
                    "description": "Critical medical supplies for field hospital running low",
                    "location": {"lat": 34.0522, "lng": 74.8336},
                    "urgency": "medium",
                    "supplies": ["surgical_instruments", "anesthetics", "iv_fluids"],
                    "weather": "windy",
                    "threatLevel": "high"
                }
            ],
            "medicalSupplies": [
                {"id": "blood_type_o", "name": "Blood Type O-", "weight": 0.5, "tempRequirement": "2-6°C", "urgency": "critical"},
                {"id": "morphine", "name": "Morphine 10mg", "weight": 0.05, "tempRequirement": "15-25°C", "urgency": "high"},
                {"id": "bandages", "name": "Emergency Bandages", "weight": 0.3, "tempRequirement": "ambient", "urgency": "medium"},
                {"id": "antibiotics", "name": "Broad Spectrum Antibiotics", "weight": 0.1, "tempRequirement": "15-25°C", "urgency": "medium"},
                {"id": "oxygen", "name": "Portable Oxygen", "weight": 1.2, "tempRequirement": "ambient", "urgency": "critical"},
                {"id": "thermal_blankets", "name": "Emergency Thermal Blankets", "weight": 0.4, "tempRequirement": "ambient", "urgency": "low"},
                {"id": "pain_medication", "name": "Pain Relief Medication", "weight": 0.15, "tempRequirement": "15-25°C", "urgency": "medium"},
                {"id": "surgical_instruments", "name": "Sterile Surgical Kit", "weight": 2.0, "tempRequirement": "sterile", "urgency": "high"},
                {"id": "anesthetics", "name": "Local Anesthetics", "weight": 0.2, "tempRequirement": "2-8°C", "urgency": "high"},
                {"id": "iv_fluids", "name": "IV Saline Solution", "weight": 1.5, "tempRequirement": "15-25°C", "urgency": "medium"}
            ],
            "weatherConditions": [
                {"type": "clear", "visibility": "10km", "windSpeed": "5kmh", "impact": "minimal", "icon": "☀️"},
                {"type": "cloudy", "visibility": "8km", "windSpeed": "15kmh", "impact": "slight", "icon": "☁️"},
                {"type": "rain", "visibility": "3km", "windSpeed": "25kmh", "impact": "moderate", "icon": "🌧️"},
                {"type": "snow", "visibility": "1km", "windSpeed": "35kmh", "impact": "significant", "icon": "❄️"},
                {"type": "storm", "visibility": "0.5km", "windSpeed": "60kmh", "impact": "severe", "icon": "⛈️"}
            ]
        };
        
        this.droneState = {
            position: {x: 50, y: 280},
            altitude: 0,
            speed: 0,
            heading: 0,
            batteryLevel: 98,
            isFlying: false,
            currentMission: null,
            missionPhase: 'ready', // ready, takeoff, navigation, delivery, return, landed
            targetPosition: null,
            waypoints: [],
            currentWaypoint: 0
        };
        
        this.telemetryData = {
            gps: {satellites: 12, accuracy: 1.2},
            communication: {signalStrength: 85, latency: 45},
            sensors: {lidar: true, camera: true, thermal: true},
            payload: {weight: 0, temperature: 4.2}
        };
        
        this.missionTimer = 0;
        this.missionStartTime = null;
        this.logEntries = [];
        this.performanceChart = null;
        
        // Initialize immediately
        this.init();
    }
    
    init() {
        console.log('Initializing Life-Line Air Simulator...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }
    
    setupApplication() {
        console.log('Setting up application...');
        
        this.setupEventListeners();
        this.populateMissionSelect();
        this.updateSystemTime();
        this.updateTelemetry();
        this.updateSystemStatus();
        this.updateWeatherInfo();
        this.updateAIRecommendations();
        this.initializeSimulation();
        
        // Initialize performance chart after a short delay to ensure canvas is ready
        setTimeout(() => {
            this.initPerformanceChart();
        }, 100);
        
        // Start real-time updates
        setInterval(() => this.updateSystemTime(), 1000);
        setInterval(() => this.updateTelemetry(), 2000);
        setInterval(() => this.simulateDroneFlight(), 100);
        setInterval(() => this.simulateObstacleDetection(), 15000);
        
        this.addLogEntry('System initialized successfully', 'success');
        this.addLogEntry('All systems operational and ready for mission', 'info');
        
        console.log('Application setup complete');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Mission selection - ensure the element exists before adding listener
        const missionSelect = document.getElementById('missionSelect');
        if (missionSelect) {
            missionSelect.addEventListener('change', (e) => {
                console.log('Mission selected:', e.target.value);
                this.selectMission(e.target.value);
            });
        }
        
        // Flight controls
        const takeoffBtn = document.getElementById('takeoffBtn');
        if (takeoffBtn) {
            takeoffBtn.addEventListener('click', () => {
                console.log('Takeoff button clicked');
                this.initiateFlightSequence();
            });
        }
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseMission());
        }
        
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.emergencyLanding());
        }
        
        const rthBtn = document.getElementById('rthBtn');
        if (rthBtn) {
            rthBtn.addEventListener('click', () => this.returnToHome());
        }
        
        const dropPayloadBtn = document.getElementById('dropPayloadBtn');
        if (dropPayloadBtn) {
            dropPayloadBtn.addEventListener('click', () => this.deployPayload());
        }
        
        // Simulation controls
        const zoomInBtn = document.getElementById('zoomInBtn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomSimulation(1.2));
        }
        
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomSimulation(0.8));
        }
        
        const resetViewBtn = document.getElementById('resetViewBtn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => this.resetSimulationView());
        }
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Modal controls
        const closeReportModal = document.getElementById('closeReportModal');
        if (closeReportModal) {
            closeReportModal.addEventListener('click', () => this.closeModal('reportModal'));
        }
        
        const closeReport = document.getElementById('closeReport');
        if (closeReport) {
            closeReport.addEventListener('click', () => this.closeModal('reportModal'));
        }
        
        const exportReport = document.getElementById('exportReport');
        if (exportReport) {
            exportReport.addEventListener('click', () => this.exportMissionReport());
        }
        
        console.log('Event listeners setup complete');
    }
    
    populateMissionSelect() {
        const select = document.getElementById('missionSelect');
        if (!select) {
            console.error('Mission select element not found');
            return;
        }
        
        console.log('Populating mission select with', this.missionData.missionScenarios.length, 'scenarios');
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // Add mission options
        this.missionData.missionScenarios.forEach(mission => {
            const option = document.createElement('option');
            option.value = mission.id;
            option.textContent = mission.name;
            select.appendChild(option);
            console.log('Added mission option:', mission.name);
        });
        
        console.log('Mission select populated successfully');
    }
    
    selectMission(missionId) {
        console.log('Selecting mission with ID:', missionId);
        
        if (!missionId || missionId === "") {
            document.getElementById('missionDetails').innerHTML = '';
            return;
        }
        
        const mission = this.missionData.missionScenarios.find(m => m.id == missionId);
        if (!mission) {
            console.error('Mission not found:', missionId);
            return;
        }
        
        console.log('Mission found:', mission.name);
        
        this.droneState.currentMission = mission;
        this.setupMissionWaypoints(mission);
        this.calculatePayloadWeight(mission.supplies);
        this.updateWeatherForMission(mission.weather);
        this.updateThreatLevel(mission.threatLevel);
        
        // Display mission details
        const supplies = mission.supplies.map(supplyId => {
            const supply = this.missionData.medicalSupplies.find(s => s.id === supplyId);
            return supply ? supply.name : supplyId;
        });
        
        const missionDetailsElement = document.getElementById('missionDetails');
        if (missionDetailsElement) {
            missionDetailsElement.innerHTML = `
                <h5>${mission.name}</h5>
                <p>${mission.description}</p>
                <div class="info-row">
                    <span>Urgency:</span>
                    <span class="status ${mission.urgency}">${mission.urgency.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span>Location:</span>
                    <span>${mission.location.lat.toFixed(4)}, ${mission.location.lng.toFixed(4)}</span>
                </div>
                <div class="mission-supplies">
                    ${supplies.map(supply => `<span class="supply-tag">${supply}</span>`).join('')}
                </div>
            `;
        }
        
        this.addLogEntry(`Mission selected: ${mission.name}`, 'info');
        this.updateMissionStatus('Mission Selected - Ready for Takeoff');
        
        // Enable takeoff button
        const takeoffBtn = document.getElementById('takeoffBtn');
        if (takeoffBtn) {
            takeoffBtn.disabled = false;
            takeoffBtn.style.opacity = '1';
        }
    }
    
    initializeSimulation() {
        // Initialize drone position
        const droneIcon = document.getElementById('droneIcon');
        if (droneIcon) {
            droneIcon.style.left = this.droneState.position.x + 'px';
            droneIcon.style.top = this.droneState.position.y + 'px';
        }
        
        // Generate some initial obstacles for realism
        this.generateInitialObstacles();
    }
    
    generateInitialObstacles() {
        const obstaclesContainer = document.getElementById('obstacles');
        if (!obstaclesContainer) return;
        
        // Create 3-4 static obstacles
        for (let i = 0; i < 4; i++) {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            obstacle.style.left = (Math.random() * 400 + 100) + 'px';
            obstacle.style.top = (Math.random() * 150 + 50) + 'px';
            obstacle.style.width = (Math.random() * 30 + 20) + 'px';
            obstacle.style.height = (Math.random() * 30 + 20) + 'px';
            obstaclesContainer.appendChild(obstacle);
        }
    }
    
    setupMissionWaypoints(mission) {
        console.log('Setting up waypoints for mission:', mission.name);
        
        // Generate waypoints based on mission location
        const baseX = 50;
        const baseY = 280;
        const targetX = Math.random() * 300 + 200;
        const targetY = Math.random() * 150 + 50;
        
        this.droneState.waypoints = [
            {x: baseX + 50, y: baseY - 50, type: 'takeoff', name: 'Takeoff Point'},
            {x: targetX * 0.4, y: targetY * 0.8, type: 'navigation', name: 'Navigation Waypoint 1'},
            {x: targetX * 0.7, y: targetY * 1.1, type: 'navigation', name: 'Navigation Waypoint 2'},
            {x: targetX, y: targetY, type: 'delivery', name: 'Delivery Zone'},
            {x: baseX + 100, y: baseY - 80, type: 'return', name: 'Return Waypoint'},
            {x: baseX, y: baseY, type: 'landing', name: 'Landing Zone'}
        ];
        
        this.droneState.currentWaypoint = 0;
        this.droneState.targetPosition = {x: targetX, y: targetY};
        
        // Update target zone position
        const targetZone = document.getElementById('targetZone');
        if (targetZone) {
            targetZone.style.left = targetX + 'px';
            targetZone.style.top = targetY + 'px';
        }
        
        // Display waypoints
        this.displayWaypoints();
        
        console.log('Waypoints setup complete:', this.droneState.waypoints.length, 'waypoints');
    }
    
    displayWaypoints() {
        const waypointsContainer = document.getElementById('waypoints');
        if (!waypointsContainer) return;
        
        waypointsContainer.innerHTML = '';
        
        this.droneState.waypoints.forEach((waypoint, index) => {
            if (waypoint.type !== 'takeoff' && waypoint.type !== 'landing') {
                const waypointEl = document.createElement('div');
                waypointEl.className = 'waypoint';
                waypointEl.style.left = waypoint.x + 'px';
                waypointEl.style.top = waypoint.y + 'px';
                waypointEl.title = waypoint.name || `Waypoint ${index + 1}`;
                waypointsContainer.appendChild(waypointEl);
            }
        });
    }
    
    calculatePayloadWeight(supplies) {
        let totalWeight = 0;
        supplies.forEach(supplyId => {
            const supply = this.missionData.medicalSupplies.find(s => s.id === supplyId);
            if (supply) {
                totalWeight += supply.weight;
            }
        });
        
        this.telemetryData.payload.weight = totalWeight;
        const payloadWeightElement = document.getElementById('payloadWeight');
        if (payloadWeightElement) {
            payloadWeightElement.textContent = `${totalWeight.toFixed(1)} kg`;
        }
        
        // Adjust payload temperature based on supplies
        const criticalSupplies = supplies.some(supplyId => {
            const supply = this.missionData.medicalSupplies.find(s => s.id === supplyId);
            return supply && supply.tempRequirement.includes('2-');
        });
        
        if (criticalSupplies) {
            this.telemetryData.payload.temperature = 3.8;
        }
        
        const payloadTempElement = document.getElementById('payloadTemp');
        if (payloadTempElement) {
            payloadTempElement.textContent = `${this.telemetryData.payload.temperature}°C`;
        }
    }
    
    updateWeatherForMission(weatherType) {
        const weather = this.missionData.weatherConditions.find(w => w.type === weatherType) || 
                       this.missionData.weatherConditions[0];
        
        const weatherIcon = document.getElementById('weatherIcon');
        const visibility = document.getElementById('visibility');
        const windSpeed = document.getElementById('windSpeed');
        const weatherImpact = document.getElementById('weatherImpact');
        
        if (weatherIcon) weatherIcon.textContent = weather.icon;
        if (visibility) visibility.textContent = weather.visibility;
        if (windSpeed) windSpeed.textContent = weather.windSpeed;
        if (weatherImpact) weatherImpact.textContent = weather.impact.charAt(0).toUpperCase() + weather.impact.slice(1);
        
        this.addLogEntry(`Weather updated: ${weather.type} - ${weather.impact} impact on mission`, 'info');
    }
    
    updateThreatLevel(level) {
        const threatIndicator = document.getElementById('threatLevel');
        const threatFactors = document.getElementById('threatFactors');
        
        if (threatIndicator) {
            threatIndicator.textContent = level.toUpperCase();
            threatIndicator.className = `threat-indicator ${level}`;
        }
        
        const factors = {
            low: ['Clear airspace', 'Minimal ground threats', 'Safe flight corridor established'],
            medium: ['Moderate weather conditions', 'Possible terrain obstacles', 'Standard threat protocols active'],
            high: ['Active threat zones detected', 'Communications interference possible', 'Enhanced security protocols required']
        };
        
        if (threatFactors) {
            threatFactors.innerHTML = factors[level].map(factor => 
                `<div>• ${factor}</div>`
            ).join('');
        }
    }
    
    initiateFlightSequence() {
        console.log('Initiating flight sequence...');
        
        if (!this.droneState.currentMission) {
            alert('Please select a mission scenario first');
            return;
        }
        
        this.droneState.isFlying = true;
        this.droneState.missionPhase = 'takeoff';
        this.missionStartTime = Date.now();
        this.missionTimer = 0;
        
        this.updateMissionStatus('Initiating Takeoff Sequence');
        this.addLogEntry('Takeoff sequence initiated', 'success');
        this.addLogEntry('All systems green - beginning autonomous flight', 'info');
        
        // Update button states
        const takeoffBtn = document.getElementById('takeoffBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const rthBtn = document.getElementById('rthBtn');
        
        if (takeoffBtn) takeoffBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (rthBtn) rthBtn.disabled = false;
        
        // Start mission timer
        this.startMissionTimer();
        
        // Simulate pre-flight sequence
        setTimeout(() => {
            this.addLogEntry('Takeoff complete - entering navigation phase', 'success');
            this.droneState.missionPhase = 'navigation';
            this.updateMissionStatus('Navigating to Target Zone');
        }, 3000);
        
        console.log('Flight sequence started successfully');
    }
    
    simulateDroneFlight() {
        if (!this.droneState.isFlying || this.droneState.waypoints.length === 0) return;
        
        const currentWaypoint = this.droneState.waypoints[this.droneState.currentWaypoint];
        if (!currentWaypoint) return;
        
        const drone = document.getElementById('droneIcon');
        if (!drone) return;
        
        const currentPos = this.droneState.position;
        const targetPos = currentWaypoint;
        
        // Calculate movement towards waypoint
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 3) {
            // Move towards waypoint
            const speed = 1.5; // pixels per frame
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;
            
            this.droneState.position.x += moveX;
            this.droneState.position.y += moveY;
            
            // Update drone visual position
            drone.style.left = this.droneState.position.x + 'px';
            drone.style.top = this.droneState.position.y + 'px';
            
            // Update telemetry
            this.droneState.speed = Math.min(45, distance * 0.8);
            this.droneState.heading = Math.atan2(dy, dx) * 180 / Math.PI;
            if (this.droneState.heading < 0) this.droneState.heading += 360;
            
            // Update altitude based on phase
            if (this.droneState.missionPhase === 'takeoff' && this.droneState.altitude < 100) {
                this.droneState.altitude += 0.8;
            } else if (this.droneState.missionPhase === 'navigation') {
                this.droneState.altitude = Math.min(150, this.droneState.altitude + 0.3);
            } else if (this.droneState.missionPhase === 'delivery') {
                this.droneState.altitude = Math.max(20, this.droneState.altitude - 0.5);
            }
            
        } else {
            // Reached waypoint
            this.droneState.currentWaypoint++;
            this.handleWaypointReached(currentWaypoint);
        }
        
        // Update telemetry display
        this.updateFlightTelemetry();
        
        // Simulate battery drain
        if (this.droneState.isFlying) {
            this.droneState.batteryLevel = Math.max(0, this.droneState.batteryLevel - 0.0008);
        }
    }
    
    handleWaypointReached(waypoint) {
        console.log('Waypoint reached:', waypoint.type);
        
        switch (waypoint.type) {
            case 'takeoff':
                this.addLogEntry('Takeoff waypoint reached - climbing to cruise altitude', 'success');
                break;
            case 'navigation':
                this.addLogEntry(`Navigation waypoint reached: ${waypoint.name}`, 'info');
                break;
            case 'delivery':
                this.addLogEntry('Delivery zone reached - hovering for payload drop', 'success');
                this.droneState.missionPhase = 'delivery';
                this.updateMissionStatus('At Delivery Zone - Ready to Deploy');
                const dropBtn = document.getElementById('dropPayloadBtn');
                if (dropBtn) dropBtn.disabled = false;
                
                // Auto-deploy after 5 seconds for demo purposes
                setTimeout(() => {
                    if (this.droneState.missionPhase === 'delivery') {
                        this.deployPayload();
                    }
                }, 5000);
                break;
            case 'return':
                this.addLogEntry('Return waypoint reached - beginning final approach', 'info');
                this.droneState.missionPhase = 'return';
                this.updateMissionStatus('Returning to Base');
                break;
            case 'landing':
                this.completeMission();
                break;
        }
    }
    
    deployPayload() {
        if (this.droneState.missionPhase !== 'delivery') return;
        
        console.log('Deploying payload...');
        
        this.addLogEntry('Payload deployment sequence initiated', 'success');
        this.addLogEntry('Medical supplies delivered successfully to target zone', 'success');
        
        // Reset payload weight
        this.telemetryData.payload.weight = 0;
        const payloadWeightElement = document.getElementById('payloadWeight');
        if (payloadWeightElement) {
            payloadWeightElement.textContent = '0.0 kg';
        }
        
        // Disable payload button and continue mission
        const dropBtn = document.getElementById('dropPayloadBtn');
        if (dropBtn) dropBtn.disabled = true;
        
        this.droneState.missionPhase = 'return';
        this.updateMissionStatus('Payload Delivered - Returning to Base');
        
        // Continue to return waypoint
        this.droneState.currentWaypoint++;
    }
    
    completeMission() {
        console.log('Mission completed successfully');
        
        this.droneState.isFlying = false;
        this.droneState.missionPhase = 'completed';
        this.droneState.altitude = 0;
        this.droneState.speed = 0;
        
        this.updateMissionStatus('Mission Complete - All Systems Secured');
        this.addLogEntry('Landing sequence complete - mission successful', 'success');
        this.addLogEntry('All systems secured and ready for next mission', 'info');
        
        // Update button states
        const takeoffBtn = document.getElementById('takeoffBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const rthBtn = document.getElementById('rthBtn');
        const dropBtn = document.getElementById('dropPayloadBtn');
        
        if (takeoffBtn) takeoffBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (rthBtn) rthBtn.disabled = true;
        if (dropBtn) dropBtn.disabled = true;
        
        // Show mission report after a brief delay
        setTimeout(() => {
            this.generateMissionReport();
        }, 3000);
    }
    
    pauseMission() {
        this.droneState.isFlying = !this.droneState.isFlying;
        const btn = document.getElementById('pauseBtn');
        
        if (!btn) return;
        
        if (this.droneState.isFlying) {
            btn.textContent = '⏸️ Pause Mission';
            this.addLogEntry('Mission resumed - continuing autonomous flight', 'info');
            this.updateMissionStatus('Mission Resumed');
        } else {
            btn.textContent = '▶️ Resume Mission';
            this.addLogEntry('Mission paused - drone holding position', 'warning');
            this.updateMissionStatus('Mission Paused');
        }
    }
    
    emergencyLanding() {
        console.log('Emergency landing initiated');
        
        this.droneState.isFlying = false;
        this.droneState.missionPhase = 'emergency';
        this.droneState.speed = 0;
        
        this.updateMissionStatus('Emergency Landing in Progress');
        this.addLogEntry('EMERGENCY: Immediate landing sequence initiated', 'error');
        this.addLogEntry('Drone secured - mission aborted for safety', 'warning');
        
        // Reset button states
        const takeoffBtn = document.getElementById('takeoffBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const rthBtn = document.getElementById('rthBtn');
        
        if (takeoffBtn) takeoffBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (rthBtn) rthBtn.disabled = true;
    }
    
    returnToHome() {
        if (!this.droneState.isFlying) return;
        
        console.log('Return to home initiated');
        
        this.droneState.missionPhase = 'return';
        this.droneState.currentWaypoint = this.droneState.waypoints.length - 2; // Return waypoint
        
        this.updateMissionStatus('Return to Home - Manual Override');
        this.addLogEntry('Manual return to home initiated', 'warning');
    }
    
    updateFlightTelemetry() {
        const altitudeEl = document.getElementById('altitude');
        const speedEl = document.getElementById('speed');
        const headingEl = document.getElementById('heading');
        
        if (altitudeEl) altitudeEl.textContent = Math.round(this.droneState.altitude) + 'm';
        if (speedEl) speedEl.textContent = Math.round(this.droneState.speed) + ' km/h';
        if (headingEl) headingEl.textContent = Math.round(this.droneState.heading) + '°';
    }
    
    updateTelemetry() {
        // Update battery
        const batteryProgress = document.getElementById('batteryProgress');
        const batteryLevel = document.getElementById('batteryLevel');
        if (batteryProgress) batteryProgress.style.width = this.droneState.batteryLevel + '%';
        if (batteryLevel) batteryLevel.textContent = Math.round(this.droneState.batteryLevel) + '%';
        
        // Simulate minor variations in telemetry
        this.telemetryData.gps.satellites = 12 + Math.floor(Math.random() * 3) - 1;
        this.telemetryData.gps.accuracy = 1.2 + (Math.random() - 0.5) * 0.4;
        this.telemetryData.communication.signalStrength = 85 + Math.floor(Math.random() * 10) - 5;
        this.telemetryData.communication.latency = 45 + Math.floor(Math.random() * 20) - 10;
        
        const satellitesEl = document.getElementById('satellites');
        const gpsAccuracyEl = document.getElementById('gpsAccuracy');
        const signalStrengthEl = document.getElementById('signalStrength');
        const latencyEl = document.getElementById('latency');
        
        if (satellitesEl) satellitesEl.textContent = this.telemetryData.gps.satellites;
        if (gpsAccuracyEl) gpsAccuracyEl.textContent = this.telemetryData.gps.accuracy.toFixed(1) + 'm';
        if (signalStrengthEl) signalStrengthEl.textContent = this.telemetryData.communication.signalStrength + '%';
        if (latencyEl) latencyEl.textContent = this.telemetryData.communication.latency + 'ms';
        
        // Update payload temperature with minor variations
        if (this.droneState.isFlying) {
            this.telemetryData.payload.temperature += (Math.random() - 0.5) * 0.1;
            this.telemetryData.payload.temperature = Math.max(2, Math.min(6, this.telemetryData.payload.temperature));
            const payloadTempEl = document.getElementById('payloadTemp');
            if (payloadTempEl) {
                payloadTempEl.textContent = this.telemetryData.payload.temperature.toFixed(1) + '°C';
            }
        }
        
        // Update mapping stats
        if (this.droneState.isFlying) {
            const areaMappedEl = document.getElementById('areaMapped');
            const pointsCapturedEl = document.getElementById('pointsCaptured');
            
            const areaMapped = (Date.now() - (this.missionStartTime || Date.now())) / 100000;
            const pointsCaptured = Math.floor(areaMapped * 50000);
            
            if (areaMappedEl) areaMappedEl.textContent = areaMapped.toFixed(2);
            if (pointsCapturedEl) pointsCapturedEl.textContent = pointsCaptured.toLocaleString();
        }
    }
    
    updateSystemStatus() {
        const statuses = {
            gpsStatus: 'ready',
            commStatus: 'ready',
            payloadStatus: 'ready',
            batteryStatus: 'ready'
        };
        
        Object.entries(statuses).forEach(([id, status]) => {
            const element = document.getElementById(id);
            if (element) {
                element.className = `status-icon ${status}`;
                element.textContent = '●';
            }
        });
    }
    
    updateSystemTime() {
        const now = new Date();
        const systemTimeEl = document.getElementById('systemTime');
        if (systemTimeEl) {
            systemTimeEl.textContent = now.toLocaleTimeString();
        }
        
        // Update mission timer
        if (this.missionStartTime) {
            const elapsed = Math.floor((Date.now() - this.missionStartTime) / 1000);
            const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            const missionTimerEl = document.getElementById('missionTimer');
            if (missionTimerEl) {
                missionTimerEl.textContent = `${hours}:${minutes}:${seconds}`;
            }
        }
    }
    
    updateMissionStatus(status) {
        const indicator = document.getElementById('missionStatusIndicator');
        if (!indicator) return;
        
        indicator.textContent = status;
        
        // Update status styling based on phase
        indicator.className = 'status-indicator';
        if (status.includes('Complete')) {
            indicator.classList.add('ready');
        } else if (status.includes('Emergency') || status.includes('Paused')) {
            indicator.classList.add('warning');
        } else if (this.droneState.isFlying) {
            indicator.classList.add('active');
        }
    }
    
    updateAIRecommendations() {
        const recommendations = [
            "✓ Optimal flight path calculated for current weather conditions",
            "⚠ Monitor payload temperature during extended flight operations",
            "✓ All medical supplies properly configured for delivery",
            "⚠ Consider alternative landing zone if winds exceed 30 km/h",
            "✓ Communication links secure and encrypted"
        ];
        
        const container = document.getElementById('aiRecommendations');
        if (container) {
            container.innerHTML = recommendations.slice(0, 3).map(rec => 
                `<div class="recommendation-item">${rec}</div>`
            ).join('');
        }
    }
    
    updateWeatherInfo() {
        // Default to clear weather
        const weather = this.missionData.weatherConditions[0];
        const weatherIcon = document.getElementById('weatherIcon');
        const visibility = document.getElementById('visibility');
        const windSpeed = document.getElementById('windSpeed');
        const weatherImpact = document.getElementById('weatherImpact');
        
        if (weatherIcon) weatherIcon.textContent = weather.icon;
        if (visibility) visibility.textContent = weather.visibility;
        if (windSpeed) windSpeed.textContent = weather.windSpeed;
        if (weatherImpact) weatherImpact.textContent = weather.impact.charAt(0).toUpperCase() + weather.impact.slice(1);
    }
    
    addLogEntry(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, message, type };
        this.logEntries.unshift(logEntry);
        
        // Keep only last 50 entries
        if (this.logEntries.length > 50) {
            this.logEntries = this.logEntries.slice(0, 50);
        }
        
        this.updateLogDisplay();
    }
    
    updateLogDisplay() {
        const container = document.getElementById('logEntries');
        if (container) {
            container.innerHTML = this.logEntries.map(entry => 
                `<div class="log-entry ${entry.type}">
                    <span class="log-timestamp">${entry.timestamp}</span>
                    <span class="log-message">${entry.message}</span>
                </div>`
            ).join('');
        }
    }
    
    startMissionTimer() {
        this.missionStartTime = Date.now();
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const tabContent = document.getElementById(tabName);
        
        if (tabBtn) tabBtn.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
        
        // Update performance chart if performance tab is selected
        if (tabName === 'performance' && this.performanceChart) {
            setTimeout(() => this.updatePerformanceChart(), 100);
        }
    }
    
    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) {
            console.error('Performance chart canvas not found');
            return;
        }
        
        console.log('Initializing performance chart...');
        
        try {
            this.performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['0s', '30s', '60s', '90s', '120s', '150s', '180s'],
                    datasets: [{
                        label: 'Altitude (m)',
                        data: [0, 20, 80, 150, 150, 100, 0],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Speed (km/h)',
                        data: [0, 15, 35, 45, 40, 25, 0],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Battery (%)',
                        data: [98, 95, 90, 85, 80, 78, 76],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
            
            console.log('Performance chart initialized successfully');
        } catch (error) {
            console.error('Error initializing performance chart:', error);
        }
    }
    
    updatePerformanceChart() {
        if (!this.performanceChart) return;
        
        console.log('Updating performance chart...');
        
        // Generate real-time data based on current flight status
        const timeLabels = [];
        const altitudeData = [];
        const speedData = [];
        const batteryData = [];
        
        const currentTime = this.missionStartTime ? (Date.now() - this.missionStartTime) / 1000 : 0;
        
        for (let i = 0; i < 7; i++) {
            const time = Math.max(0, currentTime - (6 - i) * 30);
            timeLabels.push(`${Math.floor(time)}s`);
            
            // Simulate realistic flight data
            if (time === 0) {
                altitudeData.push(0);
                speedData.push(0);
                batteryData.push(98);
            } else {
                altitudeData.push(Math.min(150, time * 2.5 + Math.random() * 20));
                speedData.push(Math.min(45, time * 0.8 + Math.random() * 10));
                batteryData.push(Math.max(70, 98 - time * 0.15));
            }
        }
        
        this.performanceChart.data.labels = timeLabels;
        this.performanceChart.data.datasets[0].data = altitudeData;
        this.performanceChart.data.datasets[1].data = speedData;
        this.performanceChart.data.datasets[2].data = batteryData;
        
        this.performanceChart.update('none');
    }
    
    generateMissionReport() {
        const mission = this.droneState.currentMission;
        if (!mission) return;
        
        const missionTime = this.missionStartTime ? 
            Math.floor((Date.now() - this.missionStartTime) / 1000) : 0;
        
        const reportContent = `
            <div class="mission-report">
                <h4>Mission: ${mission.name}</h4>
                <div class="report-section">
                    <h5>Mission Summary</h5>
                    <p><strong>Status:</strong> ${this.droneState.missionPhase === 'completed' ? 'Successfully Completed' : 'Incomplete'}</p>
                    <p><strong>Duration:</strong> ${Math.floor(missionTime / 60)}m ${missionTime % 60}s</p>
                    <p><strong>Distance Traveled:</strong> ${(Math.random() * 15 + 8).toFixed(1)} km</p>
                    <p><strong>Payload Status:</strong> ${this.telemetryData.payload.weight === 0 ? 'Successfully Delivered' : 'Still Loaded'}</p>
                    <p><strong>Mission Urgency:</strong> ${mission.urgency.toUpperCase()}</p>
                </div>
                <div class="report-section">
                    <h5>Performance Metrics</h5>
                    <p><strong>Average Speed:</strong> ${(Math.random() * 15 + 35).toFixed(1)} km/h</p>
                    <p><strong>Maximum Altitude:</strong> ${Math.round(this.droneState.altitude || 150)}m</p>
                    <p><strong>Battery Consumed:</strong> ${(98 - this.droneState.batteryLevel).toFixed(1)}%</p>
                    <p><strong>Navigation Accuracy:</strong> ±${(Math.random() * 1.5 + 0.8).toFixed(1)}m</p>
                    <p><strong>Communication Uptime:</strong> 99.7%</p>
                </div>
                <div class="report-section">
                    <h5>Medical Supplies Delivered</h5>
                    ${mission.supplies.map(supplyId => {
                        const supply = this.missionData.medicalSupplies.find(s => s.id === supplyId);
                        return supply ? `<p>• ${supply.name} (${supply.weight}kg) - ${supply.urgency} priority</p>` : '';
                    }).join('')}
                </div>
                <div class="report-section">
                    <h5>Environmental Conditions</h5>
                    <p><strong>Weather:</strong> ${mission.weather}</p>
                    <p><strong>Threat Level:</strong> ${mission.threatLevel}</p>
                    <p><strong>Obstacles Detected:</strong> ${Math.floor(Math.random() * 3 + 2)}</p>
                    <p><strong>Route Adjustments:</strong> ${Math.floor(Math.random() * 2 + 1)}</p>
                </div>
            </div>
        `;
        
        document.getElementById('reportContent').innerHTML = reportContent;
        document.getElementById('reportModal').classList.remove('hidden');
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    exportMissionReport() {
        const mission = this.droneState.currentMission;
        const missionName = mission ? mission.name : 'Unknown Mission';
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        alert(`Mission Report Exported Successfully!\n\nFilename: LifeLine_${missionName.replace(/\s+/g, '_')}_${timestamp}.pdf\n\nReport includes:\n• Complete flight telemetry data\n• Performance metrics and analytics\n• Payload delivery confirmation\n• GPS tracking and mapping data\n• Environmental condition logs\n• AI decision analysis\n\nFiles saved to mission reports directory.`);
    }
    
    // Simulation controls
    zoomSimulation(factor) {
        const simView = document.getElementById('simulationView');
        if (!simView) return;
        
        const currentScale = simView.style.transform.match(/scale\(([\d.]+)\)/);
        const scale = currentScale ? parseFloat(currentScale[1]) * factor : factor;
        const newScale = Math.max(0.5, Math.min(2, scale));
        simView.style.transform = `scale(${newScale})`;
        
        this.addLogEntry(`Simulation view ${factor > 1 ? 'zoomed in' : 'zoomed out'} to ${Math.round(newScale * 100)}%`, 'info');
    }
    
    resetSimulationView() {
        const simView = document.getElementById('simulationView');
        if (simView) {
            simView.style.transform = 'scale(1)';
            this.addLogEntry('Simulation view reset to default scale', 'info');
        }
    }
    
    simulateObstacleDetection() {
        if (!this.droneState.isFlying) return;
        
        if (Math.random() < 0.3) { // 30% chance of detecting obstacle during flight
            const obstacles = document.getElementById('obstacles');
            const alertsContainer = document.getElementById('obstacleAlerts');
            
            if (obstacles && alertsContainer) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstacle.style.left = (Math.random() * 350 + 75) + 'px';
                obstacle.style.top = (Math.random() * 150 + 50) + 'px';
                obstacle.style.width = (Math.random() * 25 + 15) + 'px';
                obstacle.style.height = (Math.random() * 25 + 15) + 'px';
                obstacles.appendChild(obstacle);
                
                // Show obstacle alert
                const alert = document.createElement('div');
                alert.className = 'alert-item warning';
                alert.textContent = 'LiDAR: Obstacle detected - autonomous avoidance engaged';
                alertsContainer.appendChild(alert);
                
                this.addLogEntry('Obstacle detected by LiDAR - adjusting flight path', 'warning');
                
                // Remove after 8 seconds
                setTimeout(() => {
                    if (obstacle.parentNode) obstacle.remove();
                    if (alert.parentNode) alert.remove();
                    
                    const clearAlert = document.createElement('div');
                    clearAlert.className = 'alert-item';
                    clearAlert.textContent = 'Flight path clear - resuming normal navigation';
                    alertsContainer.appendChild(clearAlert);
                    
                    setTimeout(() => {
                        if (clearAlert.parentNode) clearAlert.remove();
                    }, 3000);
                }, 8000);
            }
        }
    }
}

// Initialize the drone simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Life-Line Air Simulator...');
    window.droneSimulator = new DroneSimulator();
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing Life-Line Air Simulator...');
    window.droneSimulator = new DroneSimulator();
}