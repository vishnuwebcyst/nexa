import React from 'react';

const FounderCard = ({ name, role, image }) => (
    <div className="flex flex-col items-center bg-gold-900/30 border border-gold-800/20 p-6 rounded-3xl hover:bg-gold-800/20 transition-all group">
        <div className="w-24 h-24 bg-gold-600 rounded-full mb-6 border-4 border-gold-900/50 flex items-center justify-center text-gold-950 font-bold text-3xl overflow-hidden shadow-lg shadow-gold-900/20">
            {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
        </div>
        <div className="text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-gold-950 text-[10px] font-bold px-3 py-0.5 rounded-full rotate-[-2deg] shadow-md z-10">
                {name}
            </div>
            <div className="bg-gold-800/40 px-8 py-4 rounded-xl border border-gold-700/30 min-w-[160px]">
                <p className="text-xs text-gold-400 font-bold tracking-widest uppercase mt-2">{role}</p>
            </div>
        </div>
    </div>
);

const FounderMessage = () => {
    return (
        <div className="nexa-card p-10">
            <div className="flex justify-between items-start mb-8">
                <h3 className="text-4xl font-bold gold-text italic tracking-tighter uppercase">Founder's Message</h3>
                <span className="text-gold-500 font-bold underline text-sm tracking-widest">WWW.Nexaweb.live</span>
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-4xl italic">
                "At Nexa WEB, our vision is to create a powerful digital ecosystem where individuals can grow through innovation, transparency, and community strength. Our platform is built to empower people with sustainable earning opportunities through modern blockchain technology and a strong network model."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FounderCard name="Reyansh Bennett" role="Director" />
                <FounderCard name="Ayaan Dawson" role="CEO" />
                <FounderCard name="Mahiraj Parker" role="Founder" />
            </div>
        </div>
    );
};

export default FounderMessage;
