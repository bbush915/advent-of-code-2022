from timeit import default_timer as timer


def timed(fn):
    start = timer()
    result = fn()

    return ((timer() - start) * 1000, result)


def parse_input():
    with open("./src/day.3.input.txt", "r") as file:
        return file.readlines()


def part1():
    rucksacks = parse_input()

    total_priority = 0

    for rucksack in rucksacks:
        midpoint = (len(rucksack) - 1)//2

        compartment_1 = rucksack[:midpoint]
        compartment_2 = rucksack[midpoint:-1]

        for item_type in compartment_1:
            if compartment_2.find(item_type) != -1:
                total_priority += get_priority(item_type)
                break

    return total_priority


def part2():
    rucksacks = parse_input()

    total_priority = 0

    for (index, rucksack) in enumerate(rucksacks):
        if index % 3 != 2:
            continue

        elf1 = rucksack
        elf2 = rucksacks[index - 1]
        elf3 = rucksacks[index - 2]

        for item_type in elf1:
            if elf2.find(item_type) != -1 and elf3.find(item_type) != -1:
                total_priority += get_priority(item_type)
                break

    return total_priority


def get_priority(item_type: str) -> int:
    if item_type == item_type.lower():
        return ord(item_type) - 96

    return ord(item_type) - 64 + 26


(p1_elapsed, p1_answer) = timed(part1)
print(f"Part 1: {p1_answer} [{p1_elapsed:.3f} ms]")

(p2_elapsed, p2_answer) = timed(part2)
print(f"Part 2: {p2_answer} [{p2_elapsed:.3f} ms]")
