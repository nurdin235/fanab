// js/data.js

const SCHOOL_DATA = {
    "School of Health Sciences": [
        "Nursing",
        "Medical Lab Sciences",
        "Nutrition & Dietetics"
    ],
    "School of Business Studies": [
        "Accounting",
        "Marketing",
        "Banking & Finance",
        "Human Resource Management",
        "Supply Chain Management"
    ],
    "School of Education": [
        "Curriculum Studies",
        "Educational Planning & Management",
        "Didactics",
        "Guidance & Counseling"
    ],
    "School of Engineering": [
        "Software Engineering",
        "Topography & Geomatics",
        "Mechatronics Engineering",
        "Civil Engineering",
        "Electrical & Electronics Engineering"
    ],
    "School of Home Economics": [
        "Food Processing & Technology",
        "Fashion, Design & Clothing Technology",
        "Hospitality Management"
    ],
    "School of Tourism & Hotel Management": [
        "Hotel & Catering Management",
        "Travel Agency Management",
        "Ecotourism & Sustainable Tourism"
    ]
};

// Initial Sample Data (will be expanded later or generated programmatically)
// This data will be loaded into localStorage if it doesn't exist

const INITIAL_STUDENTS = [
    {
        fullName: "John Doe",
        dob: "2000-05-15",
        gender: "Male",
        phone: "+237677123456",
        email: "john.doe@example.com",
        address: "Bamenda, NW",
        previousQualification: "High School Diploma",
        school: "School of Engineering",
        field: "Software Engineering",
        programType: "HND",
        matricule: "FONAB/HND/001/2025",
        approved: true,
        results: {}, // To store course results
        password: "FONAB/HND/001/2025" // Initial password is matricule
    },
    {
        fullName: "Jane Smith",
        dob: "2001-08-22",
        gender: "Female",
        phone: "+237699765432",
        email: "jane.smith@example.com",
        address: "Buea, SW",
        previousQualification: "HND Certificate",
        school: "School of Business Studies",
        field: "Accounting",
        programType: "Degree",
        matricule: "FONAB/DEG/002/2025",
        approved: false,
        results: {},
        password: "FONAB/DEG/002/2025"
    }
];

const INITIAL_LECTURERS = [
    {
        id: "L001",
        name: "Dr. Alice Wonderland",
        email: "alice.w@fonab.com",
        department: "Software Engineering",
        assignedCourses: ["Introduction to Programming", "Web Development I"],
        password: "password123", // Stronger passwords in real app
        phone: "+237654112233"
    },
    {
        id: "L002",
        name: "Prof. Bob The Builder",
        email: "bob.b@fonab.com",
        department: "Civil Engineering",
        assignedCourses: ["Structural Analysis", "Construction Materials"],
        password: "password123",
        phone: "+237688445566"
    }
];




// js/data.js

// js/data.js

// ... (existing data like schools, lecturers, students, courses) ...

 let events = [
    // --- Past Events (for testing filtering) ---
    {
        id: 'EV2024-001',
        title: 'Freshers\' Welcome Gala 2024',
        description: 'An exciting evening to officially welcome all new students to FONAB Polytechnic, with music, food, and fun activities.',
        date: '2024-10-15',
        time: '07:00 PM - 10:00 PM',
        location: 'Polytechnic Sport Complex',
        category: 'social'
    },
    {
        id: 'EV2024-002',
        title: 'Lecturer Professional Development Workshop',
        description: 'A workshop focused on enhancing teaching methodologies and incorporating new technologies in the classroom.',
        date: '2024-11-05',
        time: '09:00 AM - 04:00 PM',
        location: 'Conference Hall, Admin Block',
        category: 'academic'
    },
    {
        id: 'EV2024-003',
        title: 'National Youth Day Celebration',
        description: 'Commemorating Cameroon\'s National Youth Day with cultural displays, debates, and sporting events.',
        date: '2024-02-11', // Past event in 2024
        time: 'All Day',
        location: 'Campus Wide',
        category: 'social'
    },
    {
        id: 'EV2024-004',
        title: 'Submission Deadline for Project Proposals (Sem 1)',
        description: 'Last day for students to submit their first-semester project proposals to their respective departments.',
        date: '2024-12-01',
        time: '05:00 PM',
        location: 'Department Offices / Online',
        category: 'deadline'
    },
    {
        id: 'EV2024-005',
        title: 'End of Year Examinations (2024)',
        description: 'Final examinations for all programs for the 2024 academic year.',
        date: '2024-12-15', // Start date
        time: 'Various Times',
        location: 'Various Exam Halls',
        category: 'academic'
    },

    // --- Current/Upcoming Events (keeping your existing ones and adding more) ---
    {
        id: 'EV001',
        title: 'Orientation Day for New Students',
        description: 'Welcome and orientation session for all newly admitted students. Learn about campus resources, academic expectations, and student life.',
        date: '2025-09-01', // September
        time: '09:00 AM - 01:00 PM',
        location: 'Main Auditorium',
        category: 'academic'
    },
    {
        id: 'EV002',
        title: 'Mid-Semester Break',
        description: 'Enjoy a well-deserved break! No classes will be held during this period.',
        date: '2025-10-20', // October
        time: 'All Day',
        location: 'Campus Wide',
        category: 'holiday'
    },
    {
        id: 'EV003',
        title: 'Career Fair 2025',
        description: 'Connect with leading companies looking for talented polytechnic graduates. Bring your CVs!',
        date: '2025-11-15', // November
        time: '10:00 AM - 04:00 PM',
        location: 'Sports Complex Hall',
        category: 'social'
    },
    {
        id: 'EV004',
        title: 'Registration Deadline for Spring Semester',
        description: 'Last day to register for courses for the Spring Semester 2026 without late fees.',
        date: '2025-12-10', // December
        time: '05:00 PM',
        location: 'Online / Academic Office',
        category: 'deadline'
    },
    {
        id: 'EV005',
        title: 'End of Year Celebration & Awards',
        description: 'Join us to celebrate the achievements of the academic year and honor outstanding students and staff.',
        date: '2025-12-20', // December
        time: '06:00 PM - 09:00 PM',
        location: 'University Garden',
        category: 'social'
    },
    {
        id: 'EV006',
        title: 'HND/Degree Examination Period',
        description: 'Final examinations for all HND and Degree programs. Good luck, students!',
        date: '2026-01-05', // January 2026
        time: 'All Day',
        location: 'Various Exam Halls',
        category: 'academic'
    },
    {
        id: 'EV007',
        title: 'Admissions Open for 2026/2027 Academic Year',
        description: 'Applications now open for all new programs. Visit our admissions office or apply online.',
        date: '2026-02-01', // February 2026
        time: 'All Day',
        location: 'Admissions Office / Online',
        category: 'admissions'
    },
    {
        id: 'EV008',
        title: 'Alumni Networking Mixer',
        description: 'An opportunity for current students and alumni to connect, share experiences, and explore career paths.',
        date: '2025-09-25', // September
        time: '05:30 PM - 08:00 PM',
        location: 'Polytechnic Cafeteria',
        category: 'social'
    },
    {
        id: 'EV009',
        title: 'Research & Innovation Fair',
        description: 'Showcasing student and faculty research projects and innovative solutions to community problems.',
        date: '2025-11-01', // November
        time: '09:00 AM - 03:00 PM',
        location: 'Science & Technology Block',
        category: 'academic'
    },
    {
        id: 'EV010',
        title: 'Sports Day & Inter-Departmental Games',
        description: 'A day of friendly competition and sportsmanship among various departments and faculties.',
        date: '2025-10-05', // October
        time: '08:00 AM - 05:00 PM',
        location: 'Polytechnic Playgrounds',
        category: 'social'
    },
    {
        id: 'EV011',
        title: 'Community Outreach Program: Health Awareness',
        description: 'Students and staff participating in a health awareness campaign in Mile 3 Nkwen community.',
        date: '2025-09-10', // September
        time: '09:00 AM - 02:00 PM',
        location: 'Mile 3 Nkwen Community Hall',
        category: 'social'
    },
    {
        id: 'EV012',
        title: 'Application Deadline for Scholarships',
        description: 'Last day to submit applications for various academic scholarships for the next academic year.',
        date: '2025-09-30', // September
        time: '04:00 PM',
        location: 'Scholarship Office / Online',
        category: 'deadline'
    },
    {
        id: 'EV013',
        title: 'Public Lecture: Future of AI in Africa',
        description: 'A distinguished guest speaker discusses the transformative impact of Artificial Intelligence on the African continent.',
        date: '2025-11-20', // November
        time: '02:00 PM - 04:00 PM',
        location: 'Main Auditorium',
        category: 'academic'
    },
    {
        id: 'EV014',
        title: 'Matriculation Ceremony 2025',
        description: 'Formal ceremony for the matriculation of new students into various programs at FONAB Polytechnic.',
        date: '2025-09-15', // September
        time: '10:00 AM - 12:00 PM',
        location: 'Polytechnic Arena',
        category: 'academic'
    },
    {
        id: 'EV015',
        title: 'Environmental Cleanup Drive',
        description: 'Join us for a campus and community cleanup initiative, promoting environmental responsibility.',
        date: '2025-10-28', // October
        time: '08:00 AM - 12:00 PM',
        location: 'Campus & Surrounding Areas',
        category: 'social'
    }
];








const INITIAL_ADMINS = [
    {
        username: "admin",
        password: "adminpassword", // Use a stronger password in production
        name: "Main Administrator",
        permissions: ["manageStudents", "manageLecturers", "manageDepartments", "viewReports"]
    },
    {
        username: "registrar",
        password: "registrarpass",
        name: "Registrar Office",
        permissions: ["manageStudents", "approveApplications"]
    }
];

const INITIAL_COURSES = [
    { id: "SWD101", name: "Introduction to Programming", school: "School of Engineering", field: "Software Engineering", lecturerId: "L001" },
    { id: "WEB201", name: "Web Development I", school: "School of Engineering", field: "Software Engineering", lecturerId: "L001" },
    { id: "ACC101", name: "Financial Accounting I", school: "School of Business Studies", field: "Accounting", lecturerId: null }, // Lecturer can be assigned later
    { id: "NUR101", name: "Anatomy & Physiology", school: "School of Health Sciences", field: "Nursing", lecturerId: null }
];

const INITIAL_EVENTS = [
    { id: "E001", title: "Orientation Day 2025", date: "2025-09-01", time: "09:00 AM", location: "Main Auditorium", description: "Welcome to all new students!" },
    { id: "E002", title: "Career Fair", date: "2025-10-15", time: "10:00 AM", location: "Sports Complex", description: "Meet potential employers and explore career opportunities." }
];