from datetime import timedelta
import random
from faker import Faker
import csv

fake = Faker()


def generate_fake_data(num_rows):
    """Generates fake data and returns it as a list of lists."""

    meeting_times = [
        "Mondays 10:00 AM - 10:30 AM", "Mondays 10:30 AM - 11:00 AM", "Mondays 11:00 AM - 11:30 AM",
        "Mondays 11:30 AM - 12:00  PM", "Wednesday 1:30 PM - 2:00 PM", "Wednesday 2:00 PM - 2:30 PM",
        "Wednesday 2:30 PM - 3:00 PM", "Thursday 9:00 AM - 9:30 AM", "Thursday 9:30 AM - 10:00 AM",
        "Thursday 10:00 AM - 10:30 AM", "Friday 3:00 PM - 3:30 PM"
    ]

    data = []
    for i in range(num_rows):
        start_time = fake.date_time_this_month()
        completion_time = start_time + timedelta(minutes=random.randint(1, 10))
        start_time_str = start_time.strftime("%m/%d/%y %H:%M:%S")
        completion_time_str = completion_time.strftime("%m/%d/%y %H:%M:%S")
        available_times = ";".join(random.sample(
            meeting_times, k=random.randint(1, 8))) + ";"

        data.append([
            i,
            start_time_str,
            completion_time_str,
            fake.email(),
            fake.name(),
            "",
            fake.phone_number(),
            available_times
        ])
    return data


def write_to_csv(data, filename="csv\\fake_data.csv"):
    """Writes the data to a CSV file."""
    header = ["ID", "Start time", "Completion time", "Email", "Name", "Last modified time", "Phone number",
              "What times are you available to meet with Dr. Stewart? (please select all times that you are available)"]
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        writer.writerows(data)


if __name__ == "__main__":
    # for i in range(1, 5):
    #     fake_data = generate_fake_data(i * 25)
    #     write_to_csv(fake_data, f"csv\\fake_data_{i}.csv")
        
    for i in range(5):
        fake_data = generate_fake_data(4)
        write_to_csv(fake_data, f"csv\\fake_data_realistic_{i}.csv")

    # fake_data = generate_fake_data(10)
    # write_to_csv(fake_data)

    print("done.")
