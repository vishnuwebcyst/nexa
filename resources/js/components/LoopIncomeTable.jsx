import React from 'react';

const LoopIncomeTable = () => {
    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const packages = [
        { name: 'EXCITE', base: 0.75 },
        { name: 'ELITE', base: 4.5 },
        { name: 'APEX', base: 13.5 },
        { name: 'ZENITH', base: 40.5 },
        { name: 'OMEGA', base: 121.5 },
        { name: 'LEGACY CLUB', base: 364.5 },
    ];

    const calculateIncome = (base, level) => {
        // Based on the provided table, each level doubles the previous one
        return (base * Math.pow(2, level - 1)).toLocaleString(undefined, { minimumFractionDigits: 1 });
    };

    const calculateTotal = (base) => {
        let total = 0;
        for(let i=1; i<=10; i++) {
            total += (base * Math.pow(2, i - 1));
        }
        return total.toLocaleString(undefined, { minimumFractionDigits: 1 });
    }

    return (
        <div className="nexa-card p-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold gold-text uppercase tracking-widest italic">Nexa Loop Income</h3>
                <span className="text-xs text-gold-500 font-bold border border-gold-800/50 px-3 py-1 rounded-full bg-gold-900/20">WWW.Nexaweb.live</span>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gold-800/20 text-gold-400 text-xs font-bold">
                        <th className="p-3 border border-gold-800/50">SR.</th>
                        {packages.map(pkg => (
                            <th key={pkg.name} className="p-3 border border-gold-800/50 text-center">NEXA {pkg.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {levels.map(lvl => (
                        <tr key={lvl} className="text-center hover:bg-gold-800/10 transition-colors">
                            <td className="p-3 border border-gold-800/30 font-bold text-gold-500 bg-gold-900/10">{lvl}</td>
                            {packages.map(pkg => (
                                <td key={pkg.name} className="p-3 border border-gold-800/30 text-white font-medium">
                                    {calculateIncome(pkg.base, lvl)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gold-600/10 text-gold-300 font-bold">
                        <td className="p-3 border border-gold-800/50">TOTAL</td>
                        {packages.map(pkg => (
                            <td key={pkg.name} className="p-3 border border-gold-800/50 text-center text-lg text-gold-400">
                                {calculateTotal(pkg.base)}
                            </td>
                        ))}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default LoopIncomeTable;
