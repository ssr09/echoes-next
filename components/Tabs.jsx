import { useRouter } from 'next/router';
import classNames from 'classnames';

export default function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'random', label: 'Feed' },
    { id: 'trending', label: 'Trending' },
    { id: 'top', label: 'Top' }
  ];
  
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={classNames('tab', { active: activeTab === tab.id })}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 