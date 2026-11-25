const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const {
  GLOBAL_MACHINES_BASELINE,
  GLOBAL_CLIENTS_BASELINE,
  LOCAL_MACHINES_BASELINE,
  LOCAL_CUSTOMERS_BASELINE,
  LOCAL_PARTNERS_BASELINE,
  LOCAL_EXPENSES_BASELINE,
  LOCAL_PAYMENTS_BASELINE
} = require('./data/seeds');

const GlobalMachine = require('./models/GlobalMachine');
const GlobalClient = require('./models/GlobalClient');
const GlobalSale = require('./models/GlobalSale');
const GlobalDisbursement = require('./models/GlobalDisbursement');
const GlobalConfig = require('./models/GlobalConfig');

const LocalMachine = require('./models/LocalMachine');
const LocalCustomer = require('./models/LocalCustomer');
const LocalPayment = require('./models/LocalPayment');
const LocalPartner = require('./models/LocalPartner');
const LocalExpense = require('./models/LocalExpense');
const LocalConfig = require('./models/LocalConfig');
const AlertLog = require('./models/AlertLog');
const ChinaShipment = require('./models/ChinaShipment');
const { getHistoricalChinaShipmentSeed } = require('./services/chinaImportService');

const SAMPLE_GLOBAL_SALES = [
  {
    id: "INV-2026-001",
    date: "2026-08-10",
    machineId: "M-01",
    qty: 12,
    unitPrice: 71200,
    frozenExchangeRate: 330,
    frozenUnitCost: 51200,
    serialNumbers: "SN-DDL-8700-101 to 112",
    customer: "Brandix Apparel Solutions Ltd",
    phone: "011-4727000",
    region: "Mirigama Export Processing Zone",
    clientId: "gc_1",
    profitAllocation: "CONSORTIUM_50_50",
    payment: "Bank Wire / BOC SLIPS",
    paymentStatus: "PAID",
    paidAmount: 854400,
    warranty: "1-Year Comprehensive Warranty (Motor & PCB)",
    cancelled: false
  },
  {
    id: "INV-2026-002",
    date: "2026-08-18",
    machineId: "M-04",
    qty: 3,
    unitPrice: 379600,
    frozenExchangeRate: 330,
    frozenUnitCost: 354600,
    serialNumbers: "SN-FBX-201 to 203",
    customer: "MAS Holdings (Bodyline Division)",
    phone: "034-4298000",
    region: "Horana Industrial Zone",
    clientId: "gc_2",
    profitAllocation: "CONSORTIUM_50_50",
    payment: "Direct Corporate Wire",
    paymentStatus: "PAID",
    paidAmount: 1138800,
    warranty: "2-Year Extended Industrial Electronics Warranty",
    cancelled: false
  },
  {
    id: "INV-2026-003",
    date: "2026-08-25",
    machineId: "M-08",
    qty: 8,
    unitPrice: 70590,
    frozenExchangeRate: 330,
    frozenUnitCost: 47590,
    serialNumbers: "SN-M700-301 to 308",
    customer: "Hirdaramani Garments Ltd",
    phone: "011-4797000",
    region: "Kahathuduwa Apparel Complex",
    clientId: "gc_3",
    profitAllocation: "CONSORTIUM_50_50",
    payment: "Bank Wire / SLIPS",
    paymentStatus: "PARTIAL",
    paidAmount: 400000,
    warranty: "1-Year Factory Support",
    cancelled: false
  },
  {
    id: "INV-2026-004",
    date: "2026-09-02",
    machineId: "M-02",
    qty: 5,
    unitPrice: 81450,
    frozenExchangeRate: 330,
    frozenUnitCost: 59450,
    serialNumbers: "SN-DDL-8700DD-01 to 05",
    customer: "Jay Jay Mills Lanka",
    phone: "011-2489000",
    region: "Seethawaka BOI Export Zone",
    clientId: "gc_4",
    profitAllocation: "CONSORTIUM_50_50",
    payment: "Commercial Bank Transfer",
    paymentStatus: "PAID",
    paidAmount: 407250,
    warranty: "1-Year Comprehensive Warranty",
    cancelled: false
  }
];

const SAMPLE_GLOBAL_DISBURSEMENTS = [
  { id: "DIS-01", date: "2026-08-20", partner: "X", amount: 150000, memo: "Interim Dividend - Partner X" },
  { id: "DIS-02", date: "2026-08-20", partner: "Y", amount: 150000, memo: "Interim Dividend - Partner Y (Global)" }
];

async function seedDatabase() {
  const uri = process.env.MONGO_URI;
  console.log("=================================================");
  console.log("===   ENTERPRISE ERP DEMO SEED INITIALIZATION ===");
  console.log("=================================================");
  console.log(`Target MongoDB Cluster: ${uri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[CONNECTED] Database: ${mongoose.connection.db.databaseName}`);

    // Clear existing collections for a completely clean and reproducible demo state
    console.log("\n[1/3] Clearing existing demo collections...");
    await Promise.all([
      GlobalMachine.deleteMany({}),
      GlobalClient.deleteMany({}),
      GlobalSale.deleteMany({}),
      GlobalDisbursement.deleteMany({}),
      GlobalConfig.deleteMany({}),
      LocalMachine.deleteMany({}),
      LocalCustomer.deleteMany({}),
      LocalPayment.deleteMany({}),
      LocalPartner.deleteMany({}),
      LocalExpense.deleteMany({}),
      LocalConfig.deleteMany({}),
      AlertLog.deleteMany({}),
      ChinaShipment.deleteMany({})
    ]);
    console.log("✓ Existing collections cleared successfully.");

    // Insert Configurations
    console.log("\n[2/3] Seeding Configurations & Master Entities...");
    await GlobalConfig.create({ usdRate: 330.00, lang: 'en' });
    await LocalConfig.create({
      activeMonth: "2026-10",
      allMonths: ["2026-08", "2026-09", "2026-10", "2026-11"],
      company: {
        name: "ENTERPRISES ERP SOLUTIONS",
        regNo: "PV/WP/78412",
        taglineEn: "INDUSTRIAL SEWING MACHINERY FLEET, AUTOMATION & MAINTENANCE",
        taglineSi: "කාර්මික මහන මැෂින් කුලියට දීම, නඩත්තුව සහ අලෙවිය",
        addressEn: "200/2B/1, Central Yard Logistics Hub, Kosgama, Sri Lanka",
        addressSi: "200/2බී/1, මධ්‍යම අංගන සැපයුම් මධ්‍යස්ථානය, කොස්ගම, ශ්‍රී ලංකාව",
        hotline: "077 412 7702",
        email: "info@enterprises-erp.com"
      },
      bank: {
        bankNameEn: "Bank Of Ceylon",
        accountName: "ENTERPRISES ERP SOLUTIONS",
        accountNo: "94459826",
        branchEn: "Corporate Banking Division"
      },
      alertSettings: {
        enabled: true,
        dueDayOfMonth: 5,
        senderEmail: "notifications@enterprises-erp.com",
        adminNotificationEmail: "admin@enterprises-erp.com",
        cronHour: 8
      }
    });

    // Global Module Baseline
    await GlobalMachine.insertMany(GLOBAL_MACHINES_BASELINE);
    await GlobalClient.insertMany(GLOBAL_CLIENTS_BASELINE);
    await GlobalSale.insertMany(SAMPLE_GLOBAL_SALES);
    await GlobalDisbursement.insertMany(SAMPLE_GLOBAL_DISBURSEMENTS);

    // China Import Shipment
    const historicalShipment = getHistoricalChinaShipmentSeed();
    await ChinaShipment.create(historicalShipment);

    // Local Module Baseline
    await LocalMachine.insertMany(LOCAL_MACHINES_BASELINE);
    await LocalCustomer.insertMany(LOCAL_CUSTOMERS_BASELINE);
    await LocalPartner.insertMany(LOCAL_PARTNERS_BASELINE);
    await LocalExpense.insertMany(LOCAL_EXPENSES_BASELINE);
    await LocalPayment.insertMany(LOCAL_PAYMENTS_BASELINE);

    console.log("\n[3/3] Verifying seeded records...");
    const counts = {
      globalMachines: await GlobalMachine.countDocuments(),
      globalClients: await GlobalClient.countDocuments(),
      globalSales: await GlobalSale.countDocuments(),
      globalDisbursements: await GlobalDisbursement.countDocuments(),
      chinaShipments: await ChinaShipment.countDocuments(),
      localMachines: await LocalMachine.countDocuments(),
      localCustomers: await LocalCustomer.countDocuments(),
      localPartners: await LocalPartner.countDocuments(),
      localExpenses: await LocalExpense.countDocuments(),
      localPayments: await LocalPayment.countDocuments()
    };

    console.log("✓ Seeding Verification Report:");
    for (const [key, count] of Object.entries(counts)) {
      console.log(`   - ${key.padEnd(20)} : ${count} documents`);
    }

    console.log("\n>>> SUCCESS: MongoDB Atlas Demo Database fully populated and ready for presentation! <<<\n");
    process.exit(0);
  } catch (err) {
    console.error("FATAL Seeding Error:", err);
    process.exit(1);
  }
}

seedDatabase();
