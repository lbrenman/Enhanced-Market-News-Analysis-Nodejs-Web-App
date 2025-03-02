document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const refreshBtn = document.getElementById('refresh-btn');
  const loadingIndicator = document.getElementById('loading-indicator');
  const content = document.getElementById('content');
  const newsContainer = document.getElementById('news-container');
  const sentimentContainer = document.getElementById('sentiment-container');
  const consumerContainer = document.getElementById('consumer-container');
  const volatilityContainer = document.getElementById('volatility-container');

  // Fetch data from API
  async function fetchMarketData() {
    try {
      showLoading();
      
      const response = await fetch('/api/market-news');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      renderData(data);
      
      hideLoading();
    } catch (error) {
      console.error('Error:', error);
      hideLoading();
      alert('Failed to load market data. Please try again later.');
    }
  }

  // Show loading indicator
  function showLoading() {
    content.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
  }

  // Hide loading indicator
  function hideLoading() {
    loadingIndicator.classList.add('hidden');
    content.classList.remove('hidden');
  }

  // Format Unix timestamp to readable date
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Render market news as vertical list
  function renderNews(marketNews) {
    newsContainer.innerHTML = '';
    
    marketNews.forEach(news => {
      const newsCard = document.createElement('div');
      newsCard.className = 'card news-card';
      
      const imageUrl = news.image || 'https://via.placeholder.com/300x160?text=No+Image';
      
      newsCard.innerHTML = `
        <div class="news-image-container">
          <img src="${imageUrl}" alt="${news.headline}" class="news-image" onerror="this.src='https://via.placeholder.com/300x160?text=Image+Not+Available'">
        </div>
        <div class="news-content">
          <div class="news-source">${news.source} · ${news.category}</div>
          <h3 class="news-headline">${news.headline}</h3>
          <p class="news-summary">${news.summary}</p>
          <div class="news-footer">
            <a href="${news.url}" target="_blank" class="news-link">Read more →</a>
            <div class="news-date">${formatDate(news.datetime)}</div>
          </div>
        </div>
      `;
      
      newsContainer.appendChild(newsCard);
    });
  }

  // Render market sentiment
  function renderSentiment(sentiments) {
    sentimentContainer.innerHTML = '';
    
    sentiments.forEach(sentiment => {
      const sentimentCard = document.createElement('div');
      sentimentCard.className = 'card sentiment-card';
      
      const sentimentClass = sentiment.sentiment.toLowerCase();
      
      let pointsHTML = '';
      sentiment.keyPoints.forEach(point => {
        pointsHTML += `<li class="sentiment-point">${point}</li>`;
      });
      
      sentimentCard.innerHTML = `
        <div class="sentiment-header">
          <div class="sentiment-category">${sentiment.category}</div>
          <div class="sentiment-badge ${sentimentClass}">${sentiment.sentiment}</div>
        </div>
        <ul class="sentiment-points">
          ${pointsHTML}
        </ul>
      `;
      
      sentimentContainer.appendChild(sentimentCard);
    });
  }

  // Render consumer behavior insights
  function renderConsumerBehavior(behaviors) {
    consumerContainer.innerHTML = '';
    
    behaviors.forEach(behavior => {
      const behaviorCard = document.createElement('div');
      behaviorCard.className = 'card consumer-card';
      
      const impactClass = behavior.impact.toLowerCase();
      
      behaviorCard.innerHTML = `
        <div class="trend-header">
          <div class="trend-name">${behavior.trend}</div>
          <div class="impact-badge ${impactClass}">${behavior.impact} impact</div>
        </div>
        <p class="trend-description">${behavior.description}</p>
      `;
      
      consumerContainer.appendChild(behaviorCard);
    });
  }

  // Render volatility and investment insights
  function renderVolatility(volatilities) {
    volatilityContainer.innerHTML = '';
    
    volatilities.forEach(item => {
      const volatilityCard = document.createElement('div');
      volatilityCard.className = 'card volatility-card';
      
      const volatilityClass = item.volatility.toLowerCase();
      const riskClass = item.riskLevel.toLowerCase();
      
      volatilityCard.innerHTML = `
        <div class="asset-header">
          <div class="asset-class">${item.assetClass}</div>
        </div>
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Volatility</div>
            <div class="metric-value ${volatilityClass}">${item.volatility}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Risk Level</div>
            <div class="metric-value ${riskClass}">${item.riskLevel}</div>
          </div>
        </div>
        <div class="investment-opportunity">
          ${item.investmentOpportunity}
        </div>
      `;
      
      volatilityContainer.appendChild(volatilityCard);
    });
  }

  // Render all data
  function renderData(data) {
    renderNews(data.MarketNews);
    renderSentiment(data.insights.MarketSentiment);
    renderConsumerBehavior(data.insights.ConsumerBehaviorInsights);
    renderVolatility(data.insights.VolatilityAndInvestmentInsights);
  }

  // Event listener for refresh button
  refreshBtn.addEventListener('click', fetchMarketData);

  // Initial data fetch
  fetchMarketData();
});