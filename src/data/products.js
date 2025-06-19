import { IS_ARGENTINA } from '@/constans/country';
import { competitors } from './competitors';

export async function fetchProductsFromApi() {
  try {
    const response = await fetch(IS_ARGENTINA ? 'https://public.nilus.co/catalogs/v1/catalogs/5/products?country_id=1&tier_id=22&size=2000&page=1&flash_deals_only=true' : 'https://public.nilus.co/catalogs/v1/catalogs/1/products?country_id=2&tier_id=10&size=2000&page=1&flash_deals_only=true');
    const data = await response.json();

    const tz = 'America/Argentina/Buenos_Aires';
    const nowLocalString = new Date().toLocaleString('sv-SE', { timeZone: tz });
    const now = new Date(nowLocalString);

    let filteredData = data.data.slice(0, 500)
      .filter(product => product["product-discount"]);

    filteredData = filteredData.map(product => {
      const disc = product["product-discount"];
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        disc.end_date = disc.end_date.replace(
          /^\d{4}-\d{2}-\d{2}/,
          `${yyyy}-${mm}-${dd}`
        );
      return product;
    });

    filteredData.sort((a, b) => {
      const endA = new Date(a["product-discount"].end_date);
      const endB = new Date(b["product-discount"].end_date);
      const expiredA = endA <= now;
      const expiredB = endB <= now;
      if (!expiredA && expiredB) return -1;
      if (expiredA && !expiredB) return 1;
      return endA.getTime() - endB.getTime();
    });

    // Return the initial products immediately
    return filteredData;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const getCompetitorPricesApi = async (erp_code, mercaditoPrice, newPrice) => {
  try {
    const response = await fetch(`https://us-central1-nilus-prod.cloudfunctions.net/pricingreport/verification/${erp_code}?country_id=${IS_ARGENTINA? "1": "2"}`);
    
    if (!response.ok) {
        if (response.status === 400) {
            return [{
                name: 'Mercadito',
                logo: '/images/mercadito.png',
                price: Math.round(mercaditoPrice) || 0
            }];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Create a map of market_id to value from the report array
    const priceMap = data.report.reduce((acc, item) => {
        acc[item.market_id] = item.value;
        return acc;
    }, {});
    
    // Find the most expensive competitor
    let mostExpensiveCompetitor = null;
    let maxPrice = -Infinity;
    competitors.forEach(competitor => {
      const price = Math.round(priceMap[competitor.name.toLowerCase()] || 0);
      if (price > maxPrice) {
        maxPrice = price;
        mostExpensiveCompetitor = {
          name: competitor.name,
          logo: competitor.logo,
          price: price
        };
      }
    });
    
    if (mostExpensiveCompetitor && mostExpensiveCompetitor.price > newPrice) {
      return [mostExpensiveCompetitor];
    } else {
      return [{
        name: 'Mercadito',
        logo: '/images/mercadito.png',
        price: Math.round(mercaditoPrice) || 0
      }];
    }
  } catch (error) {
      console.error('Error fetching competitor prices:', error);
      return [{
          name: 'Mercadito',
          logo: '/images/mercadito.png',
          price: Math.round(mercaditoPrice) || 0
      }];
  }
}

export async function addCompetitorPrices(filteredData) {
  return await Promise.all(
    filteredData.map(async (product) => {
      const newPrice = product.price * (100 - product["product-discount"].discount_percentage) / 100
      const competitorPrices = await getCompetitorPricesApi(product["master-product"].erp_code, product.price, newPrice);
      return {
        id: product.id,
        name: product["master-product"]?.name || product.name,
        category: product.category_id.toString(),
        price: newPrice,
        image: product["master-product"].image,
        description: product["master-product"]?.description,
        weight: product["master-product"]?.notes || "",
        competitorPrices,
        minimum_order_value: product.minimum_order_value,
        max_units_per_delivery: product.max_units_per_delivery
      }
    })
  );
}