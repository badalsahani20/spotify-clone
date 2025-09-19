import { useMusicStore } from '@/stores/useMusicStore'
import { Clock, Library, ListMusic, PlayCircle, Users2 } from 'lucide-react';
import StatsCard from './StatsCard';

const DashBoard = () => {

  const {stats} = useMusicStore();
  console.log("Stats from DashBoard:", stats);
  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats.totalSongs.toString(),
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },

    {
      icon: Library,
      label: "Total Albums",
      value: stats.totalAlbums.toString(),
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },

    {
      icon: Users2,
      label: "Total Artists",
      value: stats.totalArtists.toString(),
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },

    {
      icon: PlayCircle,
      label: "Total Users",
      value: stats.totalUsers.toString(),
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },

    {
      icon: Clock,
      label: "Total Minutes Listened",
      value: stats.totalListeningMinutes.toString(), // convert seconds to minutes
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
  }
  ]
   return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
      {statsData.map((stat) => (
        <StatsCard
          key={stat.label}
          icon= {stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  )
}
export default DashBoard
