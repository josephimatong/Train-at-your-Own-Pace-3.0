/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TopicData {
  code: string; // e.g., "1.1" or "2.4"
  title: string;
}

export interface ModuleData {
  title: string;
  topics: TopicData[];
}

export interface TrackData {
  name: string; // Track name e.g. "HR-Onboarding Track"
  modules: ModuleData[];
}

export const TRAINING_CATALOG: TrackData[] = [
  {
    name: 'HR-Onboarding Track',
    modules: [
      {
        title: 'Company Culture & Mission',
        topics: [
          { code: '1.1', title: 'The Origin Story: History, Founders, and Pivotal Milestones' },
          { code: '1.2', title: 'Vision, Mission, and Deep Dive into Core Values' },
          { code: '1.3', title: 'Organizational Structure: Executives, Business Units, and Department Roles' },
          { code: '1.4', title: 'Our Market Position: Key Competitors and Unique Value Propositions (UVP)' },
          { code: '1.5', title: 'Brand Identity Guidelines: Tone of Voice, Logos, and Public Presentation' },
          { code: '1.6', title: 'Major Projects Portfolio: Historical Successes and Flagship Ventures' },
          { code: '1.7', title: 'Corporate Social Responsibility (CSR) and Environmental Sustainability Goals' },
          { code: '1.8', title: 'The Strategic Roadmap: Overview of the Current 5-Year Business Plan' },
          { code: '1.9', title: 'Innovation Culture: How Internal Ideas and Improvements are Funded' },
          { code: '1.10', title: 'Meet the Leadership: Key Executive Profiles and Inter-department Alignment' }
        ]
      },
      {
        title: 'Workplace Policies & Compliance',
        topics: [
          { code: '2.1', title: 'Code of Conduct, Anti-Harassment, and Non-Discrimination Policies' },
          { code: '2.2', title: 'Data Protection & Privacy Regulation (PDPA/GDPR) Compliance' },
          { code: '2.3', title: 'Conflict of Interest, Anti-Bribery, and Whistleblowing Channels' },
          { code: '2.4', title: 'Workplace Attire, Professional Demeanor, and Attendance Expectations' },
          { code: '2.5', title: 'IT Asset Acceptable Use Policy (Hardware, Internet, Messaging Tools)' },
          { code: '2.6', title: 'Cybersecurity Essentials: Phishing Defense, MFA, and Password Policies' },
          { code: '2.7', title: 'Intellectual Property (IP) Rights and Client Non-Disclosure Agreements (NDAs)' },
          { code: '2.8', title: 'Employee Benefits, Compensation Structure, and Claim Reimbursements' },
          { code: '2.9', title: 'Leave Management: Annual, Medical, Compassionate, and Parental Leave Protocols' },
          { code: '2.10', title: 'Grievance Resolution: Step-by-Step Procedure for Conflict Resolution' }
        ]
      },
      {
        title: 'Tools & Systems Introduction',
        topics: [
          { code: '3.1', title: 'Primary Communication Architecture: Email, Slack, and Microsoft Teams Etiquette' },
          { code: '3.2', title: 'Calendar Management: Scheduling Protocols and Resource Booking (Rooms, Cars)' },
          { code: '3.3', title: 'Navigating the Employee Self-Service (ESS) HR Portal' },
          { code: '3.4', title: 'Document Ecosystem: Enterprise File Structures (SharePoint, Google Drive)' },
          { code: '3.5', title: 'Enterprise Resource Planning (ERP) Overview for Timesheets and Expenses' },
          { code: '3.6', title: 'IT Support Tickets: Raising Hardware/Software Issues Correctly' },
          { code: '3.7', title: 'Procurement Systems: Requisitions, Vendor Forms, and PO Approvals' },
          { code: '3.8', title: 'Internal Knowledge Bases: Navigating the Company Wiki and Intranet' },
          { code: '3.9', title: 'Security Badge Management: Access Control and Visitor Registration' },
          { code: '3.10', title: 'Remote Work Setup: VPN Configuration and Softphone Applications' }
        ]
      },
      {
        title: 'Role-Specific KPIs & Goals',
        topics: [
          { code: '4.1', title: 'Breaking Down the Job Description: Day-to-Day vs. Strategic Outputs' },
          { code: '4.2', title: 'Introduction to Company OKRs (Objectives & Key Results) and Personal KPIs' },
          { code: '4.3', title: 'The 30-60-90 Day Success Matrix and Probation Milestones' },
          { code: '4.4', title: 'Performance Tracking Software Walkthrough (e.g., Workday, Lattice)' },
          { code: '4.5', title: 'Setting SMART Goals with Your Line Manager' },
          { code: '4.6', title: 'Competency Frameworks: Skills Required for the Next Career Band' },
          { code: '4.7', title: 'Continuing Professional Development (CPD) and Training Credits Allocation' },
          { code: '4.8', title: 'The Routine Check-In: Maximizing the Value of Weekly 1-on-1s' },
          { code: '4.9', title: 'Mid-Year and Annual Appraisal Protocols: Self-Evaluations and Peer Reviews' },
          { code: '4.10', title: 'Feedback Loop: How to Provide Upward Feedback Safely' }
        ]
      }
    ]
  },
  {
    name: 'Safety Track',
    modules: [
      {
        title: 'Workplace Safety & Health (WSH) Fundamentals',
        topics: [
          { code: '1.1', title: 'WSH Act, Statutory Duties of Employers, and Employee Responsibilities' },
          { code: '1.2', title: 'Personal Liability, Legal Penalties, and Corporate Governance in Safety' },
          { code: '1.3', title: 'Stop Work Authority (SWA): Legal Protections and Step-by-Step Execution' },
          { code: '1.4', title: 'Incident Classification: Near-Miss vs. First Aid vs. Reportable Incident' },
          { code: '1.5', title: 'Flash Reporting: The First 60 Minutes Following an On-Site Accident' },
          { code: '1.6', title: 'Statutory Audits and Regulatory Site Inspection Frameworks' },
          { code: '1.7', title: 'Workplace Ergonomics: Minimizing Repetitive Strain and Soft Tissue Injuries' },
          { code: '1.8', title: 'Mental Health in the Workplace: Stress Management and Psychological Safety' },
          { code: '1.9', title: 'Environmental Safety: Waste Disposal, Spillage Containment, and Storage Laws' },
          { code: '1.10', title: 'Safety Culture Surveying: Measuring Behavioral Safety Trends' }
        ]
      },
      {
        title: 'Risk Assessment & Management',
        topics: [
          { code: '2.1', title: 'The Core Principles of Hazard Identification, Risk Assessment, and Risk Control' },
          { code: '2.2', title: 'Risk Assessment Matrix Construction: Evaluating Severity vs. Likelihood' },
          { code: '2.3', title: 'Applied Hierarchy of Controls: Eliminating Risks at the Design Phase' },
          { code: '2.4', title: 'Writing Effective Method Statements (RAMS) for High-Risk Works' },
          { code: '2.5', title: 'Safe Work Procedures (SWP): Developing and Updating Active Job Instructions' },
          { code: '2.6', title: 'Conducting Pre-Task Safety Briefings (Toolbox Talks) Effectively' },
          { code: '2.7', title: 'Dynamic Risk Assessment: Handling Unplanned Changes on the Shop Floor/Site' },
          { code: '2.8', title: 'Safety Inspections: Designing Checklists that Uncover Hidden Hazards' },
          { code: '2.9', title: 'Management of Change (MOC) Protocols: Keeping Risk Assessments Up to Date font-mono' },
          { code: '2.10', title: 'Root Cause Analysis (RCA): Using 5-Whys and Fishbone Diagrams Post-Incident' }
        ]
      },
      {
        title: 'Emergency Response & First Aid',
        topics: [
          { code: '3.1', title: 'Fire Dynamics: Chemistry of Fire, Fire Spread, and Prevention Strategies' },
          { code: '3.2', title: 'Selection and Operation of Fire Extinguishers, Blankets, and Hose Reels' },
          { code: '3.3', title: 'Evacuation Leadership: Duties of Fire Wardens and Search Protocols' },
          { code: '3.4', title: 'Designing and Testing Emergency Evacuation Routes and Assembly Points' },
          { code: '3.5', title: 'Triage Principles in Mass-Casualty Situations' },
          { code: '3.6', title: 'Cardiopulmonary Resuscitation (CPR) and Automated External Defibrillator (AED) Operations' },
          { code: '3.7', title: 'First Aid for Traumatic Injuries: Heavy Bleeding, Fractures, and Shock Management' },
          { code: '3.8', title: 'First Aid for Medical Emergencies: Strokes, Heart Attacks, Seizures, and Asthma' },
          { code: '3.9', title: 'Managing Heat-Related Illnesses: Heat Exhaustion vs. Life-Threatening Heat Stroke' },
          { code: '3.10', title: 'Post-Emergency De-escalation: Post-Traumatic Debriefing and Site Securing' }
        ]
      },
      {
        title: 'Specialized Safety (Site/Factory Specific)',
        topics: [
          { code: '4.1', title: 'Working at Heights: Fall Protection Plans, Anchors, Harnesses, and Lifelines' },
          { code: '4.2', title: 'Scaffolding Safety: Erecting, Inspecting, and Tagging (Green/Red Tag Systems)' },
          { code: '4.3', title: 'Confined Space Entry: Atmospheric Testing, Forced Ventilation, and Permit Systems' },
          { code: '4.4', title: 'Lockout/Tagout (LOTO): Isolation of Electrical, Hydraulic, and Pneumatic Energy' },
          { code: '4.5', title: 'Machine Guarding and Safe Operation of Automated Factory Production Lines' },
          { code: '4.6', title: 'Chemical Hazard Management: Safety Data Sheets (SDS) and Control of Hazardous Substances' },
          { code: '4.7', title: 'Heavy Lifting Operations: Crane Safety, Rigger/Signalman Communication, and Lifting Plans' },
          { code: '4.8', title: 'Hot Work Permits: Cutting, Welding, and Managing Fire Watch Zones' },
          { code: '4.9', title: 'Excavation and Shoring Safety: Preventing Cave-ins and Striking Underground Services' },
          { code: '4.10', title: 'PPE Procurement, Fit-Testing (Respirators, Earplugs), and Maintenance Audits' }
        ]
      }
    ]
  },
  {
    name: 'Technical Track',
    modules: [
      {
        title: 'Reading & Interpreting Technical Drawings',
        topics: [
          { code: '1.1', title: 'Standard Conventions: Line Types, Lettering, and Title Block Architecture' },
          { code: '1.2', title: 'Understanding Orthographic Projections, Isometric Views, and Axonometric Drawings' },
          { code: '1.3', title: 'Architectural Drawings: Floor Plans, Reflected Ceiling Plans (RCP), and Elevations' },
          { code: '1.4', title: 'Structural Drawings: Foundation Layouts, Framing Plans, and Rebar Schedules' },
          { code: '1.5', title: 'Mechanical, Electrical, Plumbing, and Fire (MEPF) Schematics and Single Line Diagrams' },
          { code: '1.6', title: 'Civil Drawings: Site Grading, Utilities Layouts, and Topographic Profiles' },
          { code: '1.7', title: 'Cross-Referencing: Tracking Details from General Arrangements to Large-Scale Blow-ups' },
          { code: '1.8', title: 'Dimensions and Tolerances: Linear, Angular, Geometric Dimensioning & Tolerancing (GD&T)' },
          { code: '1.9', title: 'Revision Control: Tracking Clouding, Delta Markups, and Revision Logs' },
          { code: '1.10', title: 'Digital Reviewing: Performing Electronic Take-offs and Markups via Bluebeam Revu' }
        ]
      },
      {
        title: 'Material Science & Construction Technology',
        topics: [
          { code: '2.1', title: 'Concrete Technology: Hydration, Mix Designs, Admixtures, and Slump Testing' },
          { code: '2.2', title: 'Structural Steelwork: Metallurgy, Deflection Properties, and Corrosion Protection Systems' },
          { code: '2.3', title: 'Timber Engineering: Mass Engineered Timber (MET), Cross-Laminated Timber (CLT) Science' },
          { code: '2.4', title: 'Masonry and Building Envelope: Brickwork, Curtain Wall Systems, and Thermal Performance' },
          { code: '2.5', title: 'Waterproofing Systems: Liquid Membranes, Torch-on Membranes, and Injection Grouting' },
          { code: '2.6', title: 'Soil Mechanics: Bearing Capacity, Deep Foundations (Piling), and Soil Stabilization' },
          { code: '2.7', title: 'Industrialized Building Systems (IBS) and Modular Prefabrication (PPVC)' },
          { code: '2.8', title: 'Advanced Composites and Smart Materials in Modern Architecture' },
          { code: '2.9', title: 'Sustainable Materials: Embodied Carbon Calculations and Green Certification Inputs' },
          { code: '2.10', title: 'Material Storage and Shelf-Life Control: Mitigating Degradation Prior to Installation' }
        ]
      },
      {
        title: 'Quality Assurance & Quality Control (QA/QC)',
        topics: [
          { code: '3.1', title: 'Building the Project Quality Plan (PQP) and Setting Up KPI Metrics' },
          { code: '3.2', title: 'Developing Inspection and Test Plans (ITP) for Individual Work Packages' },
          { code: '3.3', title: 'Material Receiving Inspection: Validating Mill Certificates, Batch Logs, and Delivery Tickets' },
          { code: '3.4', title: 'Non-Destructive Testing (NDT) Methods: Ultrasonic, Radiographic, and Magnetic Particle Testing' },
          { code: '3.5', title: 'Destructive Testing Frameworks: Concrete Cube Crushing and Tensile Strength Steel Rebar Testing' },
          { code: '3.6', title: 'Mock-up Strategies: Establishing the Quality Benchmark Bench before Mass Installation' },
          { code: '3.7', title: 'Non-Conformance Reports (NCR): Drafting, Corrective Actions, and Root Cause Analysis' },
          { code: '3.8', title: 'Auditing Subcontractor Quality Assurance Systems' },
          { code: '3.9', title: 'Workmanship Assessment Standards (e.g., CONQUAS / Quality Mark Frameworks)' },
          { code: '3.10', title: 'Quality Close-out Logs: Assembling Final Inspection Certificates for Handover' }
        ]
      },
      {
        title: 'Testing & Commissioning (T&C)',
        topics: [
          { code: '4.1', title: 'Developing a Integrated Commissioning Plan and Defining Responsibilities' },
          { code: '4.2', title: 'Pre-Commissioning Visual Checklists: Static Checks and De-watering Workflows' },
          { code: '4.3', title: 'Mechanical Commissioning: Air and Water Balancing in Complex HVAC Networks' },
          { code: '4.4', title: 'Electrical Commissioning: Megger Testing, Primary/Secondary Injection, and Load Bank Testing' },
          { code: '4.5', title: 'Hydraulic Commissioning: Pressure Testing Piping Networks and Water Quality Verification' },
          { code: '4.6', title: 'Extra Low Voltage (ELV) Testing: Access Control, CCTV, and Building Management Systems (BMS)' },
          { code: '4.7', title: 'Life Safety Integration Testing: Cause-and-Effect Matrix Verification for Fire Alarms' },
          { code: '4.8', title: 'Acoustic and Vibration Testing: Isolating Plant Machinery Noise and Sound Transmission Checks' },
          { code: '4.9', title: 'Witnessing Protocols: Coordinating Inspections with Clients, Consultants, and Authorities' },
          { code: '4.10', title: 'Compiling T&C Documentation: Logging Test Results, Defect Trackers, and Ready-to-Operate Signs' }
        ]
      }
    ]
  },
  {
    name: 'BIM & Integrated Digital Delivery (BIM-IDD) Track',
    modules: [
      {
        title: 'Introduction to BIM & IDD Frameworks',
        topics: [
          { code: '1.1', title: 'The Evolution of BIM: From 2D CAD to N-Dimensional Information Management' },
          { code: '1.2', title: 'Deep Dive into ISO 19650 Part 1 & Part 2 Frameworks and Lifecycles' },
          { code: '1.3', title: 'The IDD Ecosystem Explained: Connecting Design, Manufacture, Assembly, and Operations' },
          { code: '1.4', title: 'Exchange Information Requirements (EIR) vs. Organizational Information Requirements (OIR)' },
          { code: '1.5', title: 'Anatomy of a BIM Execution Plan (BEP): Pre-Contract vs. Post-Contract Frameworks' },
          { code: '1.6', title: 'Information Delivery Cycle: Defining Task Teams, Information Managers, and Project Delivery Teams' },
          { code: '1.7', title: 'Defining Levels of Development, Detail, and Information (LOD/LOI 100 to 500)' },
          { code: '1.8', title: 'Standard Naming Conventions and Metadata Classification Systems (OmniClass, Uniclass)' },
          { code: '1.9', title: 'BIM Metrics: Measuring Return on Investment (ROI) and Collaboration Maturity Levels' },
          { code: '1.10', title: 'Government BIM Mandates, Legal Obligations, and E-Submission Frameworks' }
        ]
      },
      {
        title: 'Authoring & Modeling (Digital Design)',
        topics: [
          { code: '2.1', title: 'Software Environment Setup: Templates, Project Parameters, and Global Coordinates' },
          { code: '2.2', title: 'Architectural Modeling Foundations: Walls, Slabs, Roofs, and Spatial Programming' },
          { code: '2.3', title: 'Structural Modeling Foundations: Piles, Columns, Beams, Framing, and Rebar Layouts' },
          { code: '2.4', title: 'MEP Modeling Foundations: Ductwork, Pipework, Cable Trays, and Equipment Space Allocation' },
          { code: '2.5', title: 'Parametric Family Creation: Designing Intelligent, Formula-Driven Revit/ArchiCAD Content' },
          { code: '2.6', title: 'Information Enrichment: Inputting Technical Attributes, Lifespans, and Cost Data into Objects' },
          { code: '2.7', title: 'Sheet Composition and Automatic Annotation Generation from 3D Model Elements' },
          { code: '2.8', title: 'Multi-Discipline Model Coordination: Linking, Monitoring, and Managing Model Changes' },
          { code: '2.9', title: 'Automated Quantity Take-Off (QTO): Extracting Cost and Material Schedules directly from Models' },
          { code: '2.10', title: 'Model Auditing: Checking Model Health, File Size Optimization, and Purging Guidelines' }
        ]
      },
      {
        title: 'Clash Detection & Collaboration (Digital Manufacturing/Assembly)',
        topics: [
          { code: '3.1', title: 'Establishing Coordination Workflows: Exporting Formats (IFC, NWC) and Frequency Protocols' },
          { code: '3.2', title: 'Navisworks Manage Interface: Appending Models and Navigating 3D Space' },
          { code: '3.3', title: 'Configuring Clash Tests: Setting Tolerances, Hard Clashes, Clearances, and Duplicates' },
          { code: '3.4', title: 'Strategic Clash Resolution: Sorting, Grouping, and Assigning Ownership of Structural/MEP Clashes' },
          { code: '3.5', title: 'BCF (BIM Collaboration Format) Workflows: Cloud-Based Issue Tracking (BIMtrack/BIMcollab)' },
          { code: '3.6', title: 'Leading Interdisciplinary Design Coordination Meetings (Clash Resolution Workshops)' },
          { code: '3.7', title: '4D Construction Simulation: Linking Project Schedules (Primavera/MS Project) to 3D Models' },
          { code: '3.8', title: '5D Cost Integration: Linking Cost Estimations to 3D Geometries for Dynamic Cash Flow Modeling' },
          { code: '3.9', title: 'Point Cloud to BIM Integration: Processing Laser Scan Data for As-Built Visualizations' },
          { code: '3.10', title: 'Virtual Design and Construction (VDC): Virtual Walkthroughs, VR/AR in Construction Coordination' }
        ]
      },
      {
        title: 'Common Data Environment (CDE) Management',
        topics: [
          { code: '4.1', title: 'Architecture of a CDE: The ISO 19650 Information States (WIP, Shared, Published, Archived)' },
          { code: '4.2', title: 'Common Data Platforms: Administering Autodesk Construction Cloud, Asite, or ProjectWise' },
          { code: '4.3', title: 'Permissions Infrastructure: Managing Roles, Companies, and Folder-Level Access Safety' },
          { code: '4.4', title: 'Document Control in the CDE: Enforcing Standard Naming Strings via Automated Validation' },
          { code: '4.5', title: 'Review Workflows: Setting Up Automated 1-Step to Multi-Step Model/Document Approval Gateways' },
          { code: '4.6', title: 'Managing Revisions and Versions: Performing Visual Sliders Comparisons of Model Iterations' },
          { code: '4.7', title: 'Transmittal and RFI Integration within a CDE Environment' },
          { code: '4.8', title: 'Data Analytics and Dashboards: Tracking Model Maturity and Pending Issues via CDE Insights' },
          { code: '4.9', title: 'Archive Control: Legal Retention Policies and Freezing Project Milestones' },
          { code: '4.10', title: 'CDE Interoperability: Connecting the Project Data Environment to Internal ERP Systems via APIs' }
        ]
      },
      {
        title: 'Digital Asset Management (Digital Operations)',
        topics: [
          { code: '5.1', title: 'Understanding COBie (Construction Operations Building Information Exchange) Schemas' },
          { code: '5.2', title: 'Mapping Revit/BIM Parameters to COBie Data Drops at Critical Project Milestones' },
          { code: '5.3', title: 'Data Validation: Using COBie Quality Control Software to Identify Missing Information' },
          { code: '5.4', title: 'As-Built Model Finalization: Striking Out Construction Variants for an Exact Digital Record' },
          { code: '5.5', title: 'Handover Strategies: Exporting Clean Data Formats for Facility Management Integration' },
          { code: '5.6', title: 'Computer-Aided Facility Management (CAFM) Systems Integration Basics' },
          { code: '5.7', title: 'Integrated Workplace Management Systems (IWMS): Linking Space Management to BIM Data' },
          { code: '5.8', title: 'Smart Buildings: Integrating IoT Sensor Feeds into the Spatial Elements of a BIM Model' },
          { code: '5.9', title: 'Digital Twin Architecture: Building Predictive Maintenance Models Using Live Operational Data' },
          { code: '5.10', title: 'Asset Lifecycle Management: Tracking Depreciation, Replacement Schedules, and Refurbishment via BIM' }
        ]
      }
    ]
  },
  {
    name: 'Operation Track',
    modules: [
      {
        title: 'Project Planning & Scheduling',
        topics: [
          { code: '1.1', title: 'Project Scope Definition: Creating the Work Breakdown Structure (WBS)' },
          { code: '1.2', title: 'Activity Sequencing: Predecessors, Successors, Leads, and Lags in Project Schedules' },
          { code: '1.3', title: 'Mastering Critical Path Method (CPM): Identifying Total Float and Free Float' },
          { code: '1.4', title: 'Software Execution: Schedule Generation in Primavera P6 and Microsoft Project' },
          { code: '1.5', title: 'Resource Loading: Assigning Labor, Equipment, and Materials to Schedule Activities' },
          { code: '1.6', title: 'Resource Leveling Strategies: Resolving Resource Over-allocation and Smooth Constraints' },
          { code: '1.7', title: 'Baseline Management: Setting, Tracking, and Re-baselining Schedules Following Delays' },
          { code: '1.8', title: 'Progress Tracking: Calculating Earned Value Management (EVM) and S-Curve Interpretation' },
          { code: '1.9', title: 'Lean Construction: Look-Ahead Planning and the Last Planner System (LPS) Workflow' },
          { code: '1.10', title: 'Delay Analysis Frameworks: Time Impact Analysis (TIA) for Extension of Time (EOT) Claims' }
        ]
      },
      {
        title: 'Site & Logistics Management',
        topics: [
          { code: '2.1', title: 'Site Layout Planning: Tower Crane Radius Optimization, Access Roads, and Security Boundaries' },
          { code: '2.2', title: 'Temporary Services Design: Water Supply, Temporary Power Distribution, and Drainage Layouts' },
          { code: '2.3', title: 'Just-In-Time (JIT) Logistics Planning: Managing Delivery Windows and Off-Site Holding Yards' },
          { code: '2.4', title: 'Material Tracking: Implementing RFID, Barcoding, and Material Flow Systems on Site' },
          { code: '2.5', title: 'Subcontractor Interface Coordination: Managing Shared Hoist, Scaffolding, and Crane Access' },
          { code: '2.6', title: 'Documenting the Site Diary: Daily Progress Logs, Weather Impact Records, and Force Majeure Tracking' },
          { code: '2.7', title: 'Environmental Controls: Noise Abatement, Vector Control, Silt Control, and Earth Control Measures (ECM)' },
          { code: '2.8', title: 'Traffic Management Planning: Vehicle Control, Pedestrian Safety, and Public Road Interfaces' },
          { code: '2.9', title: 'Waste Management Frameworks: Sorting, Recycling, and Documenting Debris Removal Legally' },
          { code: '2.10', title: 'Demobilization Protocols: Site Clearing, Temporary Power Disconnection, and Final Site Hand-back' }
        ]
      },
      {
        title: 'Procurement & Contract Administration',
        topics: [
          { code: '3.1', title: 'Sourcing and Vendor Pre-qualification Matrix Design' },
          { code: '3.2', title: 'Developing Tender Packages: Scopes of Work, Pricing Schedules, and Instruction to Tenderers' },
          { code: '3.3', title: 'Tender Evaluation Workflows: Technical Compliance Checks vs. Commercial Normalization' },
          { code: '3.4', title: 'Contract Anatomy: In-depth Review of Standard Forms of Contract (e.g., FIDIC, SIA, PSSCOC)' },
          { code: '3.5', title: 'Variation Order (VO) Management: Identifying Out-of-Scope Requests, Valuation, and Authorization' },
          { code: '3.6', title: 'Progress Claims Administration: Valuing Work Done, Evaluating Subcontractor Claims, and Payment Certs' },
          { code: '3.7', title: 'Liquidated Damages (LD) and Extension of Time (EOT) Claims Architecture' },
          { code: '3.8', title: 'Insurances, Guarantees, and Bonds: Administering Performance Bonds and Workman Compensation' },
          { code: '3.9', title: 'Dispute Avoidance Protocols: Managing Document Trails, Early Notifications, and Project Meetings' },
          { code: '3.10', title: 'Final Accounts Reconciliation: Closing Out All Claims and Releasing Retention Sums Safely' }
        ]
      },
      {
        title: 'Handover & Facility Management Integration',
        topics: [
          { code: '4.1', title: 'Defining Practical Completion Benchmarks and Drafting Substantial Completion Checklists' },
          { code: '4.2', title: 'Managing De-snagging and Defect Punch Lists: Prioritizing High vs. Low Severity Defects' },
          { code: '4.3', title: 'Assembling the Operations & Maintenance Manual (OMM) Portfolio' },
          { code: '4.4', title: 'As-Built Drawing and Certified True Copy Submissions to Statutory Authorities' },
          { code: '4.5', title: 'Client Training Coordination: Handing Over Operating Procedures for Plant and MEP Systems' },
          { code: '4.6', title: 'Managing the Defects Liability Period (DLP): SLA Response Times for Post-Handover Issues' },
          { code: '4.7', title: 'End-of-Warranty Inspections: Final Audits Prior to the Full Release of Retention Monies' },
          { code: '4.8', title: 'Asset Handover Protocols: Transitioning Spare Parts Inventories and Specialized Tools to the Client' },
          { code: '4.9', title: 'Post-Occupancy Evaluations (POE): Gathering Operations Data and Lessons Learned Reports' },
          { code: '4.10', title: 'Archiving Project Records: Legal Retention of Financial, Technical, and Contractual Files' }
        ]
      }
    ]
  }
];
