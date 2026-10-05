import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, import from here everywhere (the landing page is the only
// consumer today; dynamic route splitting keeps it out of the app routes).
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
