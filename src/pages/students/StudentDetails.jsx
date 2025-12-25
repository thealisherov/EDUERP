import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentsApi } from '../../api/students.api';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentsApi.getById(id);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Student details will be displayed here */}
      </div>
    </div>
  );
};

export default StudentDetails;

