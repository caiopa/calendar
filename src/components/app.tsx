'use client';

import Calendar from '@toast-ui/react-calendar/ie11';
import { TZDate } from '@toast-ui/calendar';
import type { EventObject, ExternalEventTypes } from '@toast-ui/calendar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { theme } from '@/utils/theme';


type ViewType = 'month' | 'week' | 'day';
const today = new TZDate();


export default function App({ view }: { view: ViewType }) {
  const calendarRef = useRef<typeof Calendar>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [initialEvents, setInitialEvents] = useState<EventObject[]>([]);

  const getCalInstance = useCallback(
    () => calendarRef.current?.getInstance?.(),
    []
  );

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText: string;

    switch (viewName) {
      case 'month': {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
        const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
          endDate < 10 ? '0' : ''
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  

  useEffect(() => {
    updateRenderRangeText();
    const eventos = async () => {
      const data = await fetch("http://localhost:3000/api/eventos").then(res => res.json());
      setInitialEvents(data);
      return data;

    };
    eventos()
  
  }, [updateRenderRangeText, initialEvents]);

  const onAfterRenderEvent: ExternalEventTypes['afterRenderEvent'] = (res: { title: any; }) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onBeforeDeleteEvent: ExternalEventTypes['beforeDeleteEvent'] = (
    res: { title?: any; id?: any; calendarId?: any; }
  ) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const { id, calendarId } = res;

    fetch('http://localhost:3000/api/eventos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
    })

    getCalInstance().deleteEvent(id, calendarId);
  };

  const onClickDayName: ExternalEventTypes['clickDayName'] = (res: { date: any; }) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if ((ev.target as HTMLButtonElement).tagName === 'BUTTON') {
      const button = ev.target as HTMLButtonElement;
      const actionName = (
        button.getAttribute('data-action') ?? 'month'
      ).replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickEvent: ExternalEventTypes['clickEvent'] = (res: { nativeEvent: any; event: any; }) => {
    console.group('onClickEvent');
    console.log('MouseEvent : ', res.nativeEvent);
    console.log('Event Info : ', res.event);
    console.groupEnd();
  };

  const onClickTimezonesCollapseBtn: ExternalEventTypes['clickTimezonesCollapseBtn'] =
    (timezoneCollapsed: boolean) => {
      console.group('onClickTimezonesCollapseBtn');
      console.log('Is Timezone Collapsed?: ', timezoneCollapsed);
      console.groupEnd();

      const newTheme = {
        'week.daygridLeft.width': '100px',
        'week.timegridLeft.width': '100px'
      };

      getCalInstance().setTheme(newTheme);
    };

  const onBeforeUpdateEvent: ExternalEventTypes['beforeUpdateEvent'] = (
    updateData: EventObject
  ) => {
    console.group('onBeforeUpdateEvent');
    console.log(updateData);
    console.groupEnd();
    const { event:{ id, calendarId, title, start, end} } = updateData;

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };

    console.log('target evento',targetEvent);
    
    console.log('antigo evento',updateData.event.start.d.d);
    console.log('changes',changes);
    
    const verififyDateStart = (d: any) => {
      console.log(d);
      
      if (d) {
        return changes.start.d.d 
      } else {
        return updateData.event.start.d.d
      }
    };
    const verififyDateEnd = (d: any) => {
       console.log(d);
       
      if (d) {
        return changes.end.d.d
      } else {
        return updateData.event.end.d.d
      }
    };

    const verifyTitle = (title: any) => {
      if (title) {
        return changes.title
      } else {
        return updateData.event.title
      }
    };

    const newEvent = {
      title: verifyTitle(changes.title),
      start: verififyDateStart(changes.start?.d.d),
      end: verififyDateEnd(changes.end?.d.d),
    }
    console.log('new evento',newEvent);
    

    getCalInstance().updateEvent(
      targetEvent.id,
      targetEvent.calendarId,
      changes
    );

    fetch('http://localhost:3000/api/eventos', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateData,id, newEvent}),
    })
  };

  const onBeforeCreateEvent: ExternalEventTypes['beforeCreateEvent'] = (eventData: { title: any; start: { d: { d: any; }; }; end: { d: { d: any; }; }; location: any; }) => {
    const event = {
      title: eventData.title,
      start: eventData.start.d.d,
      end: eventData.end.d.d,
      dueDateClass: '',
      location: eventData.location,
    };
    console.log(event);
    fetch('http://localhost:3000/api/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    
    setInitialEvents([...initialEvents, event]);
    

    getCalInstance().createEvents([event]);
  }

  

  return (
    <div>
      <h1>TOAST UI Calendar + React.js</h1>
      <div>
        <span>
          <button
            type="button"
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
            onClick={onClickNavi}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-prev"
            onClick={onClickNavi}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-next"
            onClick={onClickNavi}
          >
            Next
          </button>
        </span>
        <span className="render-range">{selectedDateRangeText}</span>
      </div>

      
      <Calendar
        className=" w-[300]"
        height="700px"
        // calendars={initialCalendars}
        month={{ startDayOfWeek: 1 }}
        usageStatistics={false} 
        events={initialEvents}
        theme={theme}
        useDetailPopup={true}
        useFormPopup={true}
        view={view}
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
          eventView: true,
          taskView: true
        }}
 
       
        isVisible={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={calendarRef}
        onAfterRenderEvent={onAfterRenderEvent}
        onBeforeDeleteEvent={onBeforeDeleteEvent}
        onClickDayname={onClickDayName}
        onClickEvent={onClickEvent}
        onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
        onBeforeUpdateEvent={onBeforeUpdateEvent}
        onBeforeCreateEvent={onBeforeCreateEvent}
      />
    </div>
  );
}
