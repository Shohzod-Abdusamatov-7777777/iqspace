const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const dbPath = path.join(__dirname, 'db.json')
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

// CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Custom middleware for handling authentication routes
server.use(jsonServer.bodyParser)

// Add custom routes for authentication
server.post('/api/auth/login', (req, res) => {
  const { phone } = req.body;

  try {
    const db = router.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const users = db.get('users').value();

    if (!users || !Array.isArray(users)) {
      return res.status(500).json({
        success: false,
        message: 'Users collection not found or invalid'
      });
    }

    // Find user by phone
    const user = users.find(u => u.phone === phone);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    // In real app, you would verify password hash
    // For demo, we'll accept any password

    const accessToken = 'mock-jwt-token-' + user.id;

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add pagination support for users endpoint
server.get('/api/users', (req, res) => {
  try {
    const db = router.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not initialized'
      });
    }
    
    const users = db.get('users').value();
    
    if (!users || !Array.isArray(users)) {
      return res.status(500).json({
        success: false,
        message: 'Users collection not found or invalid'
      });
    }

    // Get query parameters
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const search = req.query.q || '';
    const role = req.query.role || '';

    // Filter users
    let filteredUsers = users;

    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Calculate pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current_page: page,
        per_page: limit,
        total: total,
        total_pages: totalPages,
        from: offset + 1,
        to: Math.min(offset + limit, total),
        has_next: page < totalPages,
        has_prev: page > 1,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null
      }
    });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add pagination support for courses endpoint  
server.get('/api/courses', (req, res) => {
  try {
    const db = router.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not initialized'
      });
    }
    
    const courses = db.get('courses').value();
    
    if (!courses || !Array.isArray(courses)) {
      return res.status(500).json({
        success: false,
        message: 'Courses collection not found or invalid'
      });
    }

    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const subject = req.query.subject || '';
    const sortBy = req.query.sortBy || '';
    const sortOrder = req.query.sortOrder || 'asc';

    // Filter courses
    let filteredCourses = courses;

    if (search) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.teacher_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (subject) {
      filteredCourses = filteredCourses.filter(course => course.subject === subject);
    }

    // Sort courses
    if (sortBy) {
      filteredCourses.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Calculate pagination
    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(offset, offset + limit);

    // Transform data to match expected format
    const transformedCourses = paginatedCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.teacher_name,
      subject: course.subject,
      duration: course.duration,
      price: course.price,
      students: course.students_count,
      rating: course.rating,
      color: course.color,
      icon: course.icon,
      status: course.status
    }));

    res.json({
      data: transformedCourses,
      total: total,
      page: page,
      limit: limit,
      totalPages: totalPages
    });
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Claude AI Chat endpoint
server.post('/api/chat/claude', (req, res) => {
  try {
    const { messages, language = 'uz', responseLength = 'medium', context = 'general' } = req.body;
    
    // Simple mock responses based on context and language
    const mockResponses = {
      uz: {
        navigation: [
          'Men sizga navigatsiyada yordam beraman. Qaysi sahifaga o\'tmoqchisiz?',
          'Bosh sahifa, profil, kurslar yoki boshqa sahifalar orasidan tanlashingiz mumkin.',
          'Navigation menyusidan kerakli bo\'limni tanlab qo\'ying.'
        ],
        academic: [
          'Ta\'lim jarayoni bo\'yicha savollaringiz bormi? Men yordam beraman.',
          'Kurslar, topshiriqlar yoki baholar haqida ma\'lumot olish uchun so\'rang.',
          'O\'quv materiallariga qanday murojaat qilishni tushuntirib beraman.'
        ],
        general: [
          'Salom! Men sizning virtual yordamchingizman. Qanday yordam bera olaman?',
          'IQSpace LMS tizimi bo\'yicha har qanday savollaringiz borsa, so\'rang.',
          'Menga navigatsiya, kurslar yoki tizim funksiyalari haqida so\'rashingiz mumkin.'
        ]
      },
      ru: {
        navigation: [
          'Я помогу вам с навигацией. На какую страницу хотите перейти?',
          'Вы можете выбрать главную страницу, профиль, курсы или другие разделы.',
          'Выберите нужный раздел из меню навигации.'
        ],
        academic: [
          'У вас есть вопросы по учебному процессу? Я помогу.',
          'Спрашивайте о курсах, заданиях или оценках.',
          'Объясню, как получить доступ к учебным материалам.'
        ],
        general: [
          'Привет! Я ваш виртуальный помощник. Как могу помочь?',
          'Если у вас есть вопросы по системе IQSpace LMS, спрашивайте.',
          'Можете спросить меня о навигации, курсах или функциях системы.'
        ]
      },
      en: {
        navigation: [
          'I can help you with navigation. Which page would you like to go to?',
          'You can choose home page, profile, courses or other sections.',
          'Select the needed section from the navigation menu.'
        ],
        academic: [
          'Do you have questions about the learning process? I can help.',
          'Ask about courses, assignments or grades.',
          'I can explain how to access learning materials.'
        ],
        general: [
          'Hello! I am your virtual assistant. How can I help?',
          'If you have questions about IQSpace LMS system, please ask.',
          'You can ask me about navigation, courses or system functions.'
        ]
      }
    };

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage?.content?.toLowerCase() || '';
    
    // Simple keyword-based responses
    let response = '';
    let action = null;
    let helpful_tips = null;

    // Navigation keywords
    if (userText.includes('bosh sahifa') || userText.includes('home') || userText.includes('главная')) {
      response = 'Bosh sahifaga o\'tyapmiz...';
      action = '/dashboard';
    } else if (userText.includes('profil') || userText.includes('profile') || userText.includes('профиль')) {
      response = 'Profilingizga o\'tyapmiz...';
      action = '/dashboard/profile';
    } else if (userText.includes('kurs') || userText.includes('course') || userText.includes('курс')) {
      response = 'Kurslar sahifasiga o\'tyapmiz...';
      action = '/dashboard/student/courses';
      helpful_tips = 'Kurslaringizni ko\'rish va darslarni davom ettirish mumkin.';
    } else if (userText.includes('xabar') || userText.includes('message') || userText.includes('сообщени')) {
      response = 'Xabarlar sahifasiga o\'tyapmiz...';
      action = '/dashboard/messages';
    } else if (userText.includes('yordam') || userText.includes('help') || userText.includes('помощь')) {
      response = 'Men sizga quyidagi mavzularda yordam bera olaman:\n- Sahifalar bo\'ylab navigatsiya\n- Kurslar va darslar\n- Tizim funksiyalari\n- Ovoz bilan boshqarish';
      helpful_tips = 'Aniq savol bering, men yordam beraman!';
    } else {
      // Default response based on context and language
      const contextResponses = mockResponses[language]?.[context] || mockResponses.uz.general;
      response = contextResponses[Math.floor(Math.random() * contextResponses.length)];
    }

    // Adjust response length
    if (responseLength === 'short') {
      response = response.split('\n')[0]; // First line only
    } else if (responseLength === 'detailed') {
      response += '\n\nQo\'shimcha ma\'lumot yoki yordam kerak bo\'lsa, menga ayting!';
    }

    // Simulate API delay
    setTimeout(() => {
      res.json({
        response,
        action,
        helpful_tips,
        timestamp: new Date().toISOString(),
        model: 'claude-mock',
        language,
        context
      });
    }, 500); // 500ms delay to simulate real API

  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service error',
      error: error.message
    });
  }
});

// Default middlewares
server.use(middlewares)

// Use default router for other routes
server.use('/api', router)

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})