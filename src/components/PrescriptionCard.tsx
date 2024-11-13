 
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PrescriptionCardProps {
  prescription: {
    medication: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    status: string;
    endDate: string;
    instructions: string;
  };
}

export function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{prescription.medication}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {prescription.dosage} - {prescription.frequency}
            </p>
            <p className="text-sm text-gray-500">
              Prescribed by Dr. {prescription.prescribedBy}
            </p>
          </div>
          <div className="text-right">
            <Badge 
              variant={prescription.status === 'Active' ? 'default' : 'secondary'}
            >
              {prescription.status}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">
              Until {prescription.endDate}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Instructions:</strong> {prescription.instructions}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 