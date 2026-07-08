const defaultEmployees = [
  { id: "e-cody-fisher", code: "#EP5659", name: "Cody Fisher", email: "cody.fisher@company.com", phone: "+1 555 0101", gender: "Male", department: "Design", title: "Web Designer", status: "Full-time", joined: "2023-06-12", salary: 1200000 },
  { id: "e-jane-cooper", code: "#AP2589", name: "Jane Cooper", email: "jane.cooper@company.com", phone: "+1 555 0102", gender: "Female", department: "Design", title: "Product Designer", status: "Freelance", joined: "2024-01-20", salary: 950000 },
  { id: "e-albert-flores", code: "#DS9735", name: "Albert Flores", email: "albert.flores@company.com", phone: "+1 555 0103", gender: "Male", department: "Design", title: "Lead Designer", status: "Full-time", joined: "2022-09-05", salary: 1800000 },
  { id: "e-priya-sharma", code: "#EP4521", name: "Priya Sharma", email: "priya.sharma@company.com", phone: "+91 98200 11223", gender: "Female", department: "Engineering", title: "Senior Software Engineer", status: "Full-time", joined: "2022-03-14", salary: 1800000 },
  { id: "e-rohan-mehta", code: "#EP4522", name: "Rohan Mehta", email: "rohan.mehta@company.com", phone: "+91 99887 66554", gender: "Male", department: "Sales", title: "Regional Sales Manager", status: "Full-time", joined: "2021-07-01", salary: 1500000 },
  { id: "e-ananya-iyer", code: "#EP4523", name: "Ananya Iyer", email: "ananya.iyer@company.com", phone: "+91 90123 45678", gender: "Female", department: "Human Resources", title: "HR Business Partner", status: "On Leave", joined: "2023-01-09", salary: 1100000 },
  { id: "e-karan-malhotra", code: "#EP4524", name: "Karan Malhotra", email: "karan.malhotra@company.com", phone: "+91 91234 56780", gender: "Male", department: "Finance", title: "Financial Analyst", status: "Full-time", joined: "2023-11-20", salary: 950000 },
  { id: "e-neha-kulkarni", code: "#EP4525", name: "Neha Kulkarni", email: "neha.kulkarni@company.com", phone: "+91 90909 80808", gender: "Female", department: "Marketing", title: "Content Strategist", status: "Inactive", joined: "2020-05-18", salary: 900000 },
];

function makeId() {
  return "e" + Math.random().toString(36).slice(2, 10);
}

module.exports = { defaultEmployees, makeId };
