import ExploreBtn from "@/components/exploreBtn";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const Page = async () => {
    "use cache";

    cacheLife("hours");

    const events: IEvent[] = await getEvents();

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev
                <br />
                Event You Can't Miss
            </h1>

            <p className="text-center mt-5">
                Hackathons, Meetups, and Conferences, All in One Place
            </p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events?.length > 0 ? (
                        events.map((event) => (
                            <li key={event.slug} className="list-none">
                                <EventCard {...event} />
                            </li>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </ul>
            </div>
        </section>
    );
};

export default Page;