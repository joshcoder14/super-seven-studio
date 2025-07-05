import { AddonProps, TransactionProps } from "@/types/billing";

export const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
    }).format(num);
};

// Enhanced currency formatter with thousand separators
export const formatAmount = (balance: string) => {
    // Convert to number first
    const num = parseFloat(balance);
    
    // Format with thousand separators and 2 decimal places
    return formatCurrency(num.toFixed(2));
};

export const getAddonNames = (addons: AddonProps[]) => {
    return addons.map(addon => addon.add_on_name).join(', ');
}