import jmespath
import asyncio
from concurrent.futures import ThreadPoolExecutor
from rocketride import RocketRideClient
from rocketride.schema import Question, QuestionHistory

_input_executor = ThreadPoolExecutor(max_workers=1)


async def async_input(prompt: str = "") -> str:
    """Non-blocking async input that keeps the event loop responsive."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_input_executor, input, prompt)


async def main():
    client = RocketRideClient(uri="http://localhost:59083")
    await client.connect("local")

    try:
        result = await client.use(filepath="project.pipe")
        token = result["token"]
        print("Pipeline started. Itinerary Planner ready!\n")

        history = []

        # Send initial greeting trigger
        question = Question()
        question.addQuestion("Hello, I want to plan a trip.")

        for h in history:
            question.addHistory(h)

        response = await client.chat(token=token, question=question)
        answers = response.get("answers", [])
        answer = answers[0] if answers else "No response"
        print(f"Bot: {answer}\n")

        history.append(QuestionHistory(role="user", content="Hello, I want to plan a trip."))
        history.append(QuestionHistory(role="assistant", content=answer))

        # Chat loop
        while True:
            user_input = await async_input("You: ")

            if user_input.lower() in ("quit", "exit", "bye"):
                print("\nBot: Safe travels! Goodbye!")
                break

            question = Question()
            question.addQuestion(user_input)

            for h in history:
                question.addHistory(h)

            response = await client.chat(token=token, question=question)
            answers = response.get("answers", [])
            answer = answers[0] if answers else "No response"
            print(f"\nBot: {answer}\n")

            history.append(QuestionHistory(role="user", content=user_input))
            history.append(QuestionHistory(role="assistant", content=answer))

        await client.terminate(token)
    finally:
        await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())