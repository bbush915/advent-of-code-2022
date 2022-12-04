#include <stdio.h>
#include <stdlib.h>

const int BUFFER_SIZE = 8;

int part_1(FILE *);
int part_2(FILE *);

int main() {
    FILE *p_file = fopen("./src/day.1.input.txt", "r");

    if (!p_file) {
        exit(EXIT_FAILURE);
    }

    const int part_1_answer = part_1(p_file);

    rewind(p_file);

    const int part_2_answer = part_2(p_file);

    fclose(p_file);

    printf("Part 1: %d\nPart 2: %d\n", part_1_answer, part_2_answer);

    return EXIT_SUCCESS;
}

int part_1(FILE *p_file) {
    int max_elf_total = 0;
    int cur_elf_total = 0;

    char buffer[BUFFER_SIZE];

    while (fgets(buffer, BUFFER_SIZE, p_file)) {
        if (buffer[0] == '\n') {
            max_elf_total = cur_elf_total > max_elf_total ? cur_elf_total : max_elf_total;
            cur_elf_total = 0;
        } else {
            int calories = (int)strtol(buffer, NULL, 10);
            cur_elf_total += calories;
        }
    }

    return max_elf_total;
}

int part_2(FILE *p_file) {
    int max_elf_totals[3] = {0, 0, 0};
    int cur_elf_total = 0;

    char buffer[BUFFER_SIZE];

    while (fgets(buffer, BUFFER_SIZE, p_file)) {
        if (buffer[0] == '\n') {
            int i = 0;

            while (i < 3 && cur_elf_total > max_elf_totals[i]) {
                i++;
            }

            if (i > 0) {
                for (int j = i - 2; j >= 0; j--) {
                    max_elf_totals[j] = max_elf_totals[j + 1];
                }

                max_elf_totals[i - 1] = cur_elf_total;
            }

            cur_elf_total = 0;
        } else {
            int calories = (int)strtol(buffer, NULL, 10);
            cur_elf_total += calories;
        }
    }

    int sum_max_elf_totals = 0;

    for (int i = 0; i < 3; i++) {
        sum_max_elf_totals += max_elf_totals[i];
    }

    return sum_max_elf_totals;
}