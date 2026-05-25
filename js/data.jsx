/* global window */
// WQIS-PRO3S — Mock data store

const WQIS_DATA = {

  projects: [
    {
      id:'PRJ-001', code:'TPA-CHB-3',
      name:'TPA Chonburi Aseptic Line 3',
      client:'Tetra Pak Asia (TH)',
      industry:'Food & Beverage',
      startDate:'2026-01-10', endDate:'2026-06-30',
      totalWelds:450, inspected:272, status:'active',
      note:'Aseptic filling line — SUS304/316L hygienic tubing',
      staff:[
        {id:1,name:'สมชาย ใจดี',     position:'QC Inspector', team:'Mechanical', cert:'ISO 9606-1'},
        {id:2,name:'วิโรจน์ จันทร์ทอง',position:'Engineer',    team:'Process',    cert:'ASME IX'},
        {id:3,name:'นิรันดร์ กสิวัฒน์',position:'ช่างเชื่อม',  team:'Mechanical', cert:'TIG-204'},
        {id:4,name:'อาพัน รัตนา',     position:'QC Inspector', team:'QA',         cert:'ISO 9606-1'},
      ],
    },
    {
      id:'PRJ-002', code:'CPF-RYG-A',
      name:'CPF Rayong Aseptic Filling',
      client:'Charoen Pokphand Foods',
      industry:'Food & Beverage',
      startDate:'2026-02-15', endDate:'2026-08-31',
      totalWelds:620, inspected:279, status:'active',
      note:'UHT dairy line expansion — 6G position TIG welding',
      staff:[
        {id:1,name:'บุญมี แสงทอง',   position:'QC Inspector', team:'QA',         cert:'ASME IX'},
        {id:2,name:'กัญญา เพชรเจริญ', position:'Engineer',    team:'Process',    cert:''},
        {id:3,name:'ประเสริฐ อินทร์ตา',position:'ช่างเชื่อม', team:'Mechanical', cert:'TIG-312'},
      ],
    },
    {
      id:'PRJ-003', code:'BTG-NKR-1',
      name:'Betagro Nakhon Ratchasima',
      client:'Betagro PCL',
      industry:'Food & Beverage',
      startDate:'2025-10-01', endDate:'2026-02-28',
      totalWelds:310, inspected:310, status:'completed',
      note:'Finished — all welds passed final inspection',
      staff:[
        {id:1,name:'วรรณพร สุขสวัสดิ์',position:'QC Inspector',team:'QA',        cert:'ISO 9606-1'},
        {id:2,name:'สมศักดิ์ วงษ์ประดิษฐ์',position:'ช่างเชื่อม',team:'Mechanical',cert:'TIG-188'},
      ],
    },
    {
      id:'PRJ-004', code:'OSP-PTH-2',
      name:'Osotspa Pathumthani Line 2',
      client:'Osotspa PCL',
      industry:'Beverage',
      startDate:'2026-03-20', endDate:'2026-10-15',
      totalWelds:540, inspected:135, status:'active',
      note:'Carbonated beverage — stainless pressure vessel welding',
      staff:[
        {id:1,name:'นัฐพร สุขสวาท',  position:'QC Inspector', team:'QA',         cert:'ASME IX'},
        {id:2,name:'สุดา มาลาแก้ว',   position:'Engineer',    team:'Process',    cert:''},
      ],
    },
    {
      id:'PRJ-005', code:'DTM-SRB-1',
      name:'Dutch Mill Saraburi New Plant',
      client:'Dutch Mill Co., Ltd.',
      industry:'Dairy',
      startDate:'2026-06-01', endDate:'2026-12-31',
      totalWelds:380, inspected:0, status:'planning',
      note:'Pre-mobilization — site survey completed',
      staff:[],
    },
  ],

  inspections: [
    {id:'INS-001',projectId:'PRJ-001',weldId:'W-001-A01',weldType:'GTAW',welder:'สมชาย ใจดี',cert:'TIG-204',date:'2026-05-14',inspector:'QC-01',result:'pass',aiResult:'pass',comment:'ผ่านมาตรฐาน ISO 5817 Class B'},
    {id:'INS-002',projectId:'PRJ-001',weldId:'W-001-A02',weldType:'GTAW',welder:'สมชาย ใจดี',cert:'TIG-204',date:'2026-05-14',inspector:'QC-01',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-003',projectId:'PRJ-001',weldId:'W-001-A03',weldType:'GTAW',welder:'นิรันดร์ กสิวัฒน์',cert:'TIG-156',date:'2026-05-13',inspector:'QC-02',result:'fail',aiResult:'fail',comment:'พบ Porosity — ต้องแก้ไข'},
    {id:'INS-004',projectId:'PRJ-001',weldId:'W-001-B01',weldType:'GMAW',welder:'นิรันดร์ กสิวัฒน์',cert:'MIG-156',date:'2026-05-13',inspector:'QC-02',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-005',projectId:'PRJ-002',weldId:'W-002-A01',weldType:'GTAW',welder:'บุญมี แสงทอง',cert:'TIG-201',date:'2026-05-12',inspector:'QC-01',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-006',projectId:'PRJ-002',weldId:'W-002-A02',weldType:'GTAW',welder:'ประเสริฐ อินทร์ตา',cert:'TIG-312',date:'2026-05-12',inspector:'QC-03',result:'fail',aiResult:'fail',comment:'Undercut เกินมาตรฐาน'},
    {id:'INS-007',projectId:'PRJ-002',weldId:'W-002-B01',weldType:'SMAW',welder:'บุญมี แสงทอง',cert:'STK-098',date:'2026-05-11',inspector:'QC-01',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-008',projectId:'PRJ-003',weldId:'W-003-F01',weldType:'GTAW',welder:'สมศักดิ์ วงษ์ประดิษฐ์',cert:'TIG-188',date:'2026-02-20',inspector:'QC-02',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-009',projectId:'PRJ-001',weldId:'W-001-C01',weldType:'GTAW',welder:'วิโรจน์ จันทร์ทอง',cert:'TIG-188',date:'2026-05-10',inspector:'QC-01',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-010',projectId:'PRJ-004',weldId:'W-004-A01',weldType:'GMAW',welder:'นัฐพร สุขสวาท',cert:'MIG-201',date:'2026-05-08',inspector:'QC-04',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-011',projectId:'PRJ-001',weldId:'W-001-D01',weldType:'GTAW',welder:'อาพัน รัตนา',cert:'TIG-244',date:'2026-05-07',inspector:'QC-01',result:'pass',aiResult:'pass',comment:''},
    {id:'INS-012',projectId:'PRJ-002',weldId:'W-002-C01',weldType:'GTAW',welder:'กัญญา เพชรเจริญ',cert:'TIG-312',date:'2026-05-06',inspector:'QC-03',result:'fail',aiResult:'fail',comment:'Incomplete fusion'},
  ],

  standards: [
    {id:'STD-001',name:'AWS D1.1 — Structural Welding Code (Steel)',standard:'AWS D1.1',year:'2020',scope:'โครงสร้างเหล็ก',fileUrl:null,fileName:'AWS_D1.1_2020.pdf',uploadDate:'2026-03-01'},
    {id:'STD-002',name:'ASME Section IX — Welding & Brazing Qualifications',standard:'ASME IX',year:'2023',scope:'ภาชนะความดัน / F&B',fileUrl:null,fileName:'ASME_IX_2023.pdf',uploadDate:'2026-03-01'},
    {id:'STD-003',name:'ISO 5817 — Quality Levels for Imperfections',standard:'ISO 5817',year:'2023',scope:'งานเชื่อมทั่วไป',fileUrl:null,fileName:'ISO_5817_2023.pdf',uploadDate:'2026-03-05'},
    {id:'STD-004',name:'ASME BPE — Bioprocessing Equipment',standard:'ASME BPE',year:'2024',scope:'Food & Beverage / Pharma',fileUrl:null,fileName:'ASME_BPE_2024.pdf',uploadDate:'2026-04-10'},
    {id:'STD-005',name:'AWS D18.2 — Stainless Discoloration Guide',standard:'AWS D18.2',year:'2009/R2023',scope:'Stainless Steel',fileUrl:null,fileName:'AWS_D18.2_R2023.pdf',uploadDate:'2026-04-10'},
    {id:'STD-006',name:'ISO 9606-1 — Welder Qualification (Steels)',standard:'ISO 9606-1',year:'2017',scope:'ใบรับรองช่างเชื่อม',fileUrl:null,fileName:'ISO_9606-1_2017.pdf',uploadDate:'2026-04-15'},
  ],

  settings: {
    systemName: 'WQIS PRO3S',
    language: 'TH',
    notifications: { email: true, inApp: true, dailyReport: false, failAlert: true },
    ai: { confidenceThreshold: 85, colorTolerance: 10 },
  },

  weldTypes: ['GTAW (TIG)','GMAW (MIG/MAG)','SMAW (MMA)','FCAW','SAW','PAW'],
};
