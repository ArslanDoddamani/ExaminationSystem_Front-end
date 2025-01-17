import { useEffect, useState } from 'react';
import { student } from '../../services/api';
import { User } from 'lucide-react';

interface StudentProfile {
  name: string;
  USN: string;
  department: string;
  email: string;
  phone: string;
  currentSemester: number;
  dateOfBirth: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await student.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-gray-400">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-red-400">Error loading profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-700 p-3 rounded-full shadow-md">
            <User className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
        </div>
      </div>

      {/* Profile Information */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800">
        <InfoField label="USN" value={profile.USN ==='-1'?'-':profile.USN.toString()} />
        <InfoField label="Department" value={profile.department} />
        <InfoField label="Email" value={profile.email} />
        <InfoField label="Phone" value={profile.phone} />
        <InfoField label="Current Semester" value={profile.currentSemester.toString()} />
        <InfoField label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString()} />
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-800 shadow-md rounded-md p-4 border border-gray-700">
    <dt className="text-sm font-semibold text-gray-400">{label}</dt>
    <dd className="mt-2 text-lg font-medium text-gray-200">{value}</dd>
  </div>
);

export default Profile;
