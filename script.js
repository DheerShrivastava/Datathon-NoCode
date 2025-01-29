// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
})

// Navbar functionality
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Reviews slider
const reviews = document.querySelectorAll(".review-card")
const dots = document.querySelectorAll(".dot")
let currentReview = 0

function showReview(n) {
  reviews.forEach((review) => review.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  reviews[n].classList.add("active")
  dots[n].classList.add("active")
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentReview = index
    showReview(currentReview)
  })
})

// Auto-rotate reviews
setInterval(() => {
  currentReview = (currentReview + 1) % reviews.length
  showReview(currentReview)
}, 5000)

// Scroll indicator
const sections = document.querySelectorAll("section")
const indicators = document.querySelectorAll(".section-indicator span")

window.addEventListener("scroll", () => {
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id")
    }
  })

  indicators.forEach((indicator) => {
    indicator.classList.remove("active")
    if (indicator.classList.contains(current)) {
      indicator.classList.add("active")
    }
  })
})

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      })
      // Close mobile menu if open
      navLinks.classList.remove("active")
      hamburger.classList.remove("active")
    }
  })
})

