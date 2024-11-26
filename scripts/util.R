# User-defined function to read in PCIbex Farm results files
read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}


## Making functions from Anzi's original code
create_randomids <- function(df, mapping_fname, newdf_fname){
  df <- df %>%
    select(-c(Results.reception.time,
               Controller.name,
               Inner.element.number,
               Latin.Square.Group)) %>%
    rename(trial_id = id,
           ip_address = MD5.hash.of.participant.s.IP.address) 
  
    prolific_ids <- df %>%
      filter(Parameter == "prolific_id") %>%
      pull(Value)
  
    ips <- unique(df$ip_address)
    
  ip_to_id <- data.frame(prolific_id = prolific_ids, ip_address = ips)
  df <- df %>%
    left_join(ip_to_id, by = "ip_address") %>%
    select(-ip_address)
  
  set.seed(13) # make sure participants get the same random ID each time
  prolific_ids <- unique(df$prolific_id)
  random_ids <- sample(1:length(prolific_ids), length(prolific_ids), replace = FALSE)
  ip_to_id <- ip_to_id %>%
    mutate(random_id = as.character(random_ids))
  
  
  
  df <- df %>%
    left_join(ip_to_id, by = "prolific_id") %>%
    select(-c(prolific_id, ip_address))
  
  write.csv(ip_to_id, mapping_fname, row.names = FALSE)
  write.csv(df, newdf_fname)
  
  return(df)

}

get_non_us <- function(df){
  not_in_us <- df %>%
    filter(Parameter == "in_us", Value != "Yes") %>%
    pull(random_id)
  
  years_in_us <- df %>%
    filter(Parameter == "years_us") %>%
    mutate(numeric_value = as.numeric(Value)) %>%
    filter(!is.na(numeric_value) & numeric_value <= 10) %>%
    pull(random_id)
  return(c(not_in_us, years_in_us))
}

convert_value <- function(value) {
  converted_value <- sub(".*to", "", value)
  return(as.numeric(converted_value))
}

get_low_eng_use <- function(df){
  low_eng_ids <- df %>%
    filter(Parameter == "home_eng" | Parameter == "work_eng" | Parameter == "social_eng")
  dat$Value <- sapply(dat$Value, convert_value)
  dat <- dat %>%
    group_by(random_id) %>%
    summarize(avg_eng_use = mean(Value)) %>%
    mutate(random_id = fct_reorder(random_id, avg_eng_use))
  not_enough_eng <- dat %>%
    filter(avg_eng_use < 80) %>%
    pull(random_id)
  
  return(low_eng_ids)
}

get_low_acc <- function(df){
  low_acc_ids <- df %>%
    filter(PennElementName == "selection") %>%
    group_by(random_id) %>%
    summarize(accuracy = mean(Value=="correct")*100) %>%
    mutate(random_id = fct_reorder(random_id, accuracy)) %>%
    filter(accuracy < 85) %>%
    pull(random_id)
  
  return(low_acc_ids)
}
  
  
  