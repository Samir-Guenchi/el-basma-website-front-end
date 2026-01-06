import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const phoneNumber = '213780723779';
  const message = encodeURIComponent('مرحبا، أريد الاستفسار عن المنتجات');
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="Contact on WhatsApp"
    >
      {/* Icon - responsive size */}
      <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
      
      {/* Tooltip - hidden on mobile, shown on desktop */}
      <span className="hidden md:block absolute end-full me-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        WhatsApp
      </span>
      
      {/* Pulse animation for mobile to draw attention */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20 md:hidden"></span>
    </a>
  );
}
