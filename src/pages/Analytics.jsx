import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, queriesRes] = await Promise.all([
        fetch('http://localhost:3001/api/analytics'),
        fetch('http://localhost:3001/api/analytics/queries?limit=20')
      ]);
      
      if (statsRes.ok && queriesRes.ok) {
        const statsData = await statsRes.json();
        const queriesData = await queriesRes.json();
        setStats(statsData);
        setQueries(queriesData);
        setError(null);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#fff'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          ⚙️
        </motion.div>
        <span style={{ marginLeft: '10px' }}>Đang tải analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#ff6b6b',
        textAlign: 'center'
      }}>
        ❌ Lỗi: {error}
        <br />
        <button 
          onClick={fetchAnalytics}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      color: '#fff'
    }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          textAlign: 'center',
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem'
        }}
      >
        📊 Analytics Dashboard
      </motion.h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Overview Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#4fc3f7' }}>📈 Tổng quan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalQueries}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Tổng câu hỏi</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{Math.round(stats.averageResponseTime)}ms</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Thời gian phản hồi</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.uptime}h</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Thời gian hoạt động</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.queriesPerHour}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Câu hỏi/giờ</div>
              </div>
            </div>
          </motion.div>

          {/* Vietnam Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#4fc3f7' }}>🇻🇳 Thống kê Việt Nam</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.vietnamQueries}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Câu hỏi về VN</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.vietnamQueryRate}%</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Tỷ lệ câu hỏi VN</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.spaceQueries}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Câu hỏi vũ trụ</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.errorRate}%</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Tỷ lệ lỗi</div>
              </div>
            </div>
          </motion.div>

          {/* Method Usage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#4fc3f7' }}>⚙️ Phương thức xử lý</h3>
            {stats.methodUsage.map(([method, count]) => (
              <div key={method} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '5px 0'
              }}>
                <span style={{ fontSize: '14px' }}>{method}</span>
                <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </motion.div>

          {/* Popular Topics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#4fc3f7' }}>🔥 Chủ đề phổ biến</h3>
            {stats.popularTopics.slice(0, 8).map(([topic, count]) => (
              <div key={topic} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '5px 0'
              }}>
                <span style={{ fontSize: '14px' }}>{topic}</span>
                <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </motion.div>

        </div>
      )}

      {/* Recent Queries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#4fc3f7' }}>🕒 Câu hỏi gần đây</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {queries.map((query, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                padding: '10px',
                marginBottom: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                borderLeft: query.success ? '3px solid #4caf50' : '3px solid #f44336'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    {query.query}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>
                    {query.method} • {query.contextsUsed} contexts • {query.responseTime}ms
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginLeft: '10px' }}>
                  {new Date(query.timestamp).toLocaleTimeString('vi-VN')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Auto-refresh indicator */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#aaa' 
      }}>
        🔄 Tự động cập nhật mỗi 10 giây
      </div>
    </div>
  );
}