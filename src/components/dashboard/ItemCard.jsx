
import React from 'react';

const courseColorMap = {
  blue: '#3b82f6',
  green: '#10b981', 
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899',
  yellow: '#eab308',
  red: '#ef4444',
  cyan: '#06b6d4'
};

export default function ItemCard({ item, onClick, courseColor = 'blue', isMajorProject = false }) {
  const accentColor = courseColorMap[courseColor] || courseColorMap.blue;

  return (
    <div 
      className="item cursor-pointer transition-all duration-200 ease-in-out hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-1 active:translate-y-1"
      style={{
        padding: '1rem',
        background: '#fefcf7',
        border: '1px solid #8b7355',
        borderRadius: '0 8px 8px 8px', // Changed from 12px to 8px
        boxShadow: `4px 4px 0 ${accentColor}`,
        fontFamily: "'Lora', serif"
      }}
      onClick={onClick}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translate(4px, 4px)';
        e.currentTarget.style.boxShadow = `0 0 0 ${accentColor}`;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translate(2px, 2px)';
        e.currentTarget.style.boxShadow = `2px 2px 0 ${accentColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `4px 4px 0 ${accentColor}`;
      }}
    >
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
      }}>
        <div className="title" style={{
          color: '#8b7355',
          fontSize: '1rem',
          fontWeight: 600,
          fontFamily: "'Lora', serif"
        }}>
          {item.title}
        </div>
      </div>

      {item.goal && (
        <div className="goal" style={{
          fontFamily: "'Caveat', cursive",
          color: '#000000',
          fontSize: '1.5rem',
          fontWeight: 700, // Increased font weight from 600 to 700
          padding: '0.5rem', // Added for equal padding around the goal text
          textAlign: 'center', // Centered the goal text
          lineHeight: '1.3'
        }}>
          {item.goal}
        </div>
      )}

      {(item.deadline || item.course_name) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#6c6c6c',
          fontFamily: "'Lora', serif"
        }}>
          {item.deadline && (
            <div className="deadline">
              Due {new Date(item.deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} ({Math.ceil((new Date(item.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days)
            </div>
          )}
          
          {item.course_name && (
            <div 
              className="course" 
              style={{
                color: accentColor,
                fontSize: '0.85rem',
                fontWeight: 500,
                fontFamily: "'Lora', serif",
                marginLeft: '12px',
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px'
              }}
            >
              {item.course_name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
