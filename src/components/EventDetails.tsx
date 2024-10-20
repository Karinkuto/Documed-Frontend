
interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  textColor: string;
  borderColor: string;
  description?: string;
}

interface EventDetailsProps {
  event?: Event;
  date: Date;
}

export function EventDetails({ event, date }: EventDetailsProps) {
  return (
    <div className="text-xs">
      <p className="font-semibold">{date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      {event ? (
        <>
          <p className="mt-1 font-medium">{event.title}</p>
          <p className="text-gray-600">{event.id}</p>
          {event.description && <p className="mt-1">{event.description}</p>}
        </>
      ) : (
        <p className="mt-1">No events scheduled</p>
      )}
    </div>
  );
}
