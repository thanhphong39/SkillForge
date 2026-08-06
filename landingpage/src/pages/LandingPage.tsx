import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, BarChart3, Users, Layers, Globe, Award, TrendingUp, Star, Target, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import logo from '../assets/logo1.png';
import { FloatingContactButtons } from '../components/FloatingContactButtons';


export function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToPricing = () => {
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <>
      <div className="min-h-screen bg-[#0B1C2D] text-white font-sans selection:bg-[#3AE7E1] selection:text-[#0B1C2D] overflow-x-hidden">
        {/* Animated Background Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#3AE7E1] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0.2
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-[#0B1C2D]/80 backdrop-blur-md border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <motion.img
                src={logo}
                alt="SkillForge Logo"
                className="h-12 w-auto object-contain mix-blend-screen"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </Link>
            <motion.nav
              className="hidden md:flex items-center gap-8 text-sm font-medium text-shadow-slate-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <a href="#problem" className="hover:text-[#3AE7E1] transition-colors">Vấn đề</a>
              <a href="#solution" className="hover:text-[#3AE7E1] transition-colors">Giải pháp</a>
              <a href="#pricing" className="hover:text-[#3AE7E1] transition-colors">Bảng giá</a>
            </motion.nav>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a href="#solution" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Khám phá
              </a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="px-5 py-2.5 bg-[#3AE7E1] text-[#0B1C2D] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all inline-block cursor-pointer"
                >
                  Bắt đầu ngay
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3AE7E1]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />


          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-6"
                whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.5)' }}
              >
                <Zap className="w-3 h-3" /> PM 4.0 Platform
              </motion.div>
              <motion.h1
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Thực thi hóa <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE7E1] to-[#2563EB]">
                  Triết lý BSC
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Nền tảng quản trị chiến lược Top-down duy nhất tại Việt Nam biến triết lý Balanced Scorecard thành số liệu thực tế, giúp CEO SME kiểm soát toàn diện doanh nghiệp.
              </motion.p>
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#solution"
                    className="px-8 py-4 bg-gradient-to-r from-[#3AE7E1] to-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    Khám phá Tính năng
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </motion.div>
                <motion.div
                  className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#pricing" className="flex items-center gap-2">
                    Xem Bảng giá
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Dashboard Preview Simulation with Animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-[#3AE7E1] to-[#2563EB] rounded-2xl blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="relative bg-[#0F253A] border border-white/10 rounded-2xl p-6 shadow-2xl"
                whileHover={{ scale: 1.02, borderColor: 'rgba(58, 231, 225, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Fake Dashboard UI */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <motion.div
                    className="h-2 w-32 bg-white/10 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-[#3AE7E1] rounded-full"
                      animate={{ x: ['-100%', '300%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="bg-white/5 p-4 rounded-lg border border-white/5"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.2)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <motion.div
                        className="h-8 w-8 rounded bg-[#3AE7E1]/20 mb-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="h-2 w-16 bg-white/20 rounded mb-2" />
                      <div className="h-4 w-12 bg-white/10 rounded" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="w-2/3 bg-white/5 rounded-lg h-32 border border-white/5 p-4">
                    <div className="flex items-end gap-2 h-full">
                      {[40, 60, 35, 70, 50, 80, 65].map((h, i) => (
                        <motion.div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-gradient-to-t from-[#3AE7E1]/50 to-[#3AE7E1] rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 1 + i * 0.1, ease: 'easeOut' }}
                          whileHover={{ scale: 1.1 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 space-y-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 bg-white/5 p-2 rounded border border-white/5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.2)' }}
                      >
                        <motion.div
                          className="w-6 h-6 rounded-full bg-slate-600"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                        />
                        <div className="h-2 w-full bg-white/10 rounded" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated World Map Section */}
          <motion.div
            className="max-w-7xl mx-auto mt-24 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-3 h-3" /> Global Presence
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold">Được tin dùng trên toàn cầu</h3>
            </div>

            <div className="relative h-[400px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
              {/* World Map Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1000 400">
                  {/* Grid lines */}
                  {[...Array(10)].map((_, i) => (
                    <motion.line
                      key={`h-${i}`}
                      x1="0"
                      y1={i * 40}
                      x2="1000"
                      y2={i * 40}
                      stroke="rgba(58, 231, 225, 0.2)"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: i * 0.1 }}
                    />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <motion.line
                      key={`v-${i}`}
                      x1={i * 50}
                      y1="0"
                      x2={i * 50}
                      y2="400"
                      stroke="rgba(58, 231, 225, 0.2)"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: i * 0.05 }}
                    />
                  ))}
                </svg>
              </div>

              {/* Animated Connection Lines */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3AE7E1" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3AE7E1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[
                  { x1: 150, y1: 200, x2: 400, y2: 150 },
                  { x1: 400, y1: 150, x2: 650, y2: 180 },
                  { x1: 650, y1: 180, x2: 850, y2: 220 },
                  { x1: 200, y1: 280, x2: 500, y2: 260 },
                  { x1: 500, y1: 260, x2: 750, y2: 300 },
                ].map((line, idx) => (
                  <motion.line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 2,
                      delay: 2 + idx * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                ))}
              </svg>

              {/* Animated Location Markers */}
              {[
                { x: '15%', y: '50%', label: 'Americas', delay: 0 },
                { x: '40%', y: '37%', label: 'Europe', delay: 0.2 },
                { x: '65%', y: '45%', label: 'Asia', delay: 0.4 },
                { x: '85%', y: '55%', label: 'Pacific', delay: 0.6 },
              ].map((location, idx) => (
                <motion.div
                  key={idx}
                  className="absolute"
                  style={{ left: location.x, top: location.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 2.5 + location.delay,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <div className="relative">
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 -m-3 bg-[#3AE7E1] rounded-full"
                      animate={{
                        scale: [1, 2, 2],
                        opacity: [0.5, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: location.delay,
                      }}
                    />
                    {/* Main marker */}
                    <motion.div
                      className="w-4 h-4 bg-[#3AE7E1] rounded-full shadow-lg shadow-[#3AE7E1]/50 relative z-10"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: location.delay,
                      }}
                    />
                    {/* Label */}
                    <motion.div
                      className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B1C2D]/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold border border-[#3AE7E1]/30"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3 + location.delay }}
                    >
                      {location.label}
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Floating data particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#3AE7E1]/50 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="py-12 border-y border-white/5 bg-[#0F253A]/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Doanh nghiệp tin dùng', value: '500+' },
              { label: 'Dự án quản lý', value: '12k' },
              { label: 'Nhân sự Active', value: '85k' },
              { label: 'Tỷ lệ hài lòng', value: '98%' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-[#3AE7E1] uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Logo Marquee - Trusted Partners */}
        <section className="mt-8 py-16 bg-[#0B1C2D] relative overflow-hidden">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <motion.span
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3AE7E1]/10 border border-[#3AE7E1]/30 text-[#3AE7E1] text-sm font-bold"
                animate={{ boxShadow: ['0 0 8px rgba(58,231,225,0.2)', '0 0 16px rgba(58,231,225,0.4)', '0 0 8px rgba(58,231,225,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                500+
              </motion.span>
              <span className="text-slate-300 text-sm md:text-base font-medium">
                doanh nghiệp đã tin dùng <span className="text-[#3AE7E1] font-bold">SkillForge</span>
              </span>
            </div>
          </motion.div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0B1C2D] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0B1C2D] to-transparent" />

          {/* Row 1 - scroll left */}
          <div className="mb-6 overflow-hidden">
            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(2)].flatMap((_, dupeIdx) =>
                [
                  'ACB', 'VietjetAir', '247Express', 'Nippon Express', 'WinCommerce',
                  'VTVcab', 'PetroVietnam', 'FPT Software', 'Viettel', 'Masan Group',
                ].map((name, i) => (
                  <div
                    key={`r1-${dupeIdx}-${i}`}
                    className="flex-shrink-0 flex items-center justify-center h-14 px-8 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 select-none"
                  >
                    <span className="text-[15px] font-bold tracking-wide text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          </div>

          {/* Row 2 - scroll right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(2)].flatMap((_, dupeIdx) =>
                [
                  'Jollibee', 'Thaihabooks', 'Vingroup', 'Techcombank', 'CỘNG Cà Phê',
                  'ITviec', 'Stella', 'MoMo', 'VNPay', 'Shopee Vietnam',
                ].map((name, i) => (
                  <div
                    key={`r2-${dupeIdx}-${i}`}
                    className="flex-shrink-0 flex items-center justify-center h-14 px-8 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 select-none"
                  >
                    <span className="text-[15px] font-bold tracking-wide text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-24 px-6 relative overflow-hidden">
          {/* Background decoration */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3AE7E1]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Giải pháp Quản trị Chiến lược Cốt lõi
              </motion.h2>
              <motion.p
                className="text-slate-400 max-w-3xl mx-auto text-base leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Biến triết lý BSC thành hành động cụ thể, quy tụ dữ liệu rời rạc và cung cấp cho sếp góc nhìn toàn cảnh để ra quyết định tức thì.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Thẻ điểm cân bằng (BSC 4 Góc độ)',
                  tag: 'Tài chính • Khách hàng • Quy trình • Con người',
                  desc: 'Nếu chỉ nhìn doanh thu, bạn mới thấy 1/4 sức khỏe công ty. SkillForge nối liền chuỗi: Chiến lược ➔ Mục tiêu ➔ Chỉ số ➔ Tiến độ ➔ Hành động cụ thể giúp đánh giá toàn diện doanh nghiệp.',
                  gradient: 'from-[#3AE7E1]/20 to-[#2563EB]/20',
                },
                {
                  icon: Layers,
                  title: 'Góc nhìn Dữ liệu Toàn cảnh',
                  tag: 'Xoá bỏ 20 file Excel rời rạc',
                  desc: 'Thay vì dữ liệu nằm tan tác ở Kế toán, Sales, Marketing làm sếp phải tự "chắp vá", SkillForge đưa mọi dòng dữ liệu về một màn hình duy nhất. Không còn đoán mò hay chờ đợi báo cáo.',
                  gradient: 'from-[#2563EB]/20 to-[#9333EA]/20',
                },
                {
                  icon: Zap,
                  title: 'Dashboard Ra quyết định 3 Giây',
                  tag: 'Bắt trọn điểm nghẽn từ sớm',
                  desc: 'Báo cáo xịn là phải thấy ngay việc nào đang tắc, team nào sắp quá tải, khoản chi nào vượt mồi lửa. SkillForge giúp sếp nhìn ra vấn đề sớm hơn để chốt quyết định nhanh và chính xác.',
                  gradient: 'from-[#9333EA]/20 to-[#3AE7E1]/20',
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#3AE7E1]/50 transition-all group relative overflow-hidden flex flex-col justify-between`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: '0 20px 40px rgba(58, 231, 225, 0.2)',
                  }}
                >
                  {/* Animated background overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#3AE7E1]/0 to-[#2563EB]/0 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{
                      background: 'linear-gradient(to bottom right, rgba(58, 231, 225, 0.1), rgba(37, 99, 235, 0.1))'
                    }}
                  />

                  <div>
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-[#0B1C2D] border border-white/10 flex items-center justify-center mb-6 relative z-10"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                    >
                      <item.icon className="w-7 h-7 text-[#3AE7E1]" />
                    </motion.div>

                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#3AE7E1] bg-[#3AE7E1]/10 px-3 py-1 rounded-full mb-3 relative z-10">
                      {item.tag}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">{item.desc}</p>
                  </div>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-[#3AE7E1]/10 rounded-bl-full pointer-events-none"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-[#0F253A] relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3AE7E1]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Bảng giá linh hoạt
              </motion.h2>
              <motion.p
                className="text-slate-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Chọn gói phù hợp với quy mô doanh nghiệp của bạn.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: 'Gói Cơ Bản (Basic)',
                  price: '2.000.000 VNĐ',
                  unit: '/tháng',
                  features: [
                    'Đầy đủ 4 khía cạnh Thẻ điểm cân bằng (BSC)',
                    'Dashboard báo cáo quản trị tổng quan',
                    'Công cụ theo dõi & Đánh giá KPI tự động',
                    'Trợ lý AI hỗ trợ phân tích hiệu suất',
                    'Hỗ trợ kỹ thuật tiêu chuẩn (Standard Support)',
                  ],
                  popular: true,
                  ctaText: 'Đăng ký ngay',
                },
                {
                  name: 'Gói Tùy Chỉnh (Custom)',
                  price: 'Tùy chỉnh',
                  unit: '',
                  features: [
                    'Không giới hạn số lượng mục tiêu & KPI chiến lược',
                    'Tích hợp tùy biến CSDL & Hệ thống ERP/CRM của doanh nghiệp',
                    'Chuyên gia tư vấn tái cấu trúc BSC đồng hành riêng',
                    'Tính năng bảo mật nâng cao & Hạ tầng Cloud riêng',
                    'Hỗ trợ ưu tiên 24/7 cam kết SLA',
                  ],
                  popular: false,
                  ctaText: 'Liên hệ tư vấn',
                },
              ].map((plan, idx) => (
                <motion.div
                  key={idx}
                  className={`relative p-8 rounded-2xl border flex flex-col justify-between ${plan.popular
                    ? 'bg-[#0B1C2D] border-[#3AE7E1] shadow-[0_0_30px_rgba(58,231,225,0.15)] scale-105 z-10'
                    : 'bg-white/5 border-white/10'
                    }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{
                    y: -10,
                    scale: plan.popular ? 1.08 : 1.05,
                    boxShadow: plan.popular
                      ? '0 30px 60px rgba(58, 231, 225, 0.3)'
                      : '0 20px 40px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3AE7E1] text-[#0B1C2D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      animate={{
                        boxShadow: [
                          '0 0 10px rgba(58, 231, 225, 0.5)',
                          '0 0 20px rgba(58, 231, 225, 0.8)',
                          '0 0 10px rgba(58, 231, 225, 0.5)',
                        ]
                      }}
                      transition={{
                        opacity: { delay: 0.5, duration: 0.6 },
                        y: { delay: 0.5, duration: 0.6 },
                        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      Phổ biến nhất
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <motion.div
                      className="text-3xl lg:text-4xl font-bold text-[#3AE7E1] mb-6 flex items-baseline gap-1"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.15, type: 'spring', stiffness: 200 }}
                    >
                      {plan.price}
                      {plan.unit && <span className="text-sm text-slate-400 font-normal">{plan.unit}</span>}
                    </motion.div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feat, fIdx) => (
                        <motion.li
                          key={fIdx}
                          className="flex items-center gap-3 text-slate-300 text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + idx * 0.15 + fIdx * 0.1 }}
                        >
                          <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                          {feat}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (plan.popular) {
                        navigate('/checkout?plan=basic');
                      } else {
                        navigate('/custom-plan');
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.popular
                      ? 'bg-[#3AE7E1] text-[#0B1C2D] hover:bg-[#34d3cd]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {plan.ctaText}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          className="py-12 border-t border-white/10 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            &copy; 2026 SkillForge. All rights reserved.
          </motion.p>
        </motion.footer>
      </div>
      <FloatingContactButtons />
    </>
  );
}
