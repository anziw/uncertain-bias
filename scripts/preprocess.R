# Set working directory to home of repo
source('./scripts/util.R')
library(tidyverse)

dat <- read.pcibex("./data/results_gumball_vs_unk_election.csv")


dat <- create_randomids(dat, 
                        './data/randid_mapping.csv',
                        './data/results_randomized.csv')

## Filter data

non_us_ids <- get_non_us(dat)
low_eng_ids <- get_low_eng_use(dat)
low_acc_ids <- get_low_acc(dat)

exclude <- unique(c(non_us_ids, low_eng_ids, low_acc_ids))

filtered_dat <- dat %>%
  filter(!random_id %in% exclude)

## Add in relevant columns

processed_dat <- filtered_dat %>%
  filter(PennElementName %in% c("slider-1", "slider-2", "slider-3")) %>%
  select(random_id, Order.number.of.item, trial_id, PennElementName, Value) %>%
  mutate(utterance = ifelse(PennElementName == "slider-1", "probably",
                            ifelse(PennElementName == "slider-2", "might", "bare not")),
         outcome = readr::parse_number(trial_id)*10,
         event_type = ifelse(str_detect(trial_id, 'g'), 'gumball', 'election'),
         color = ifelse(str_detect(trial_id, 'p') | str_detect(trial_id, 'x'), 'purple', 'orange')) %>%
  select(-PennElementName) %>%
  rename(value = Value, trial_num = Order.number.of.item) %>%
  group_by(random_id, trial_num) %>%
  mutate(sum = sum(as.numeric(value)),
         prob = as.numeric(value)/sum) 

## Save data

write.csv(processed_dat, './data/processed_data.csv')


